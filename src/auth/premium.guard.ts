// Premium user guard
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const fullUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });

    if (!fullUser) {
      throw new ForbiddenException('User not found');
    }

    if (!fullUser.isPremium) {
      throw new ForbiddenException('Premium subscription required');
    }

    // Check if premium subscription is still valid
    if (fullUser.premiumExpiresAt && fullUser.premiumExpiresAt < new Date()) {
      throw new ForbiddenException('Premium subscription expired');
    }

    return true;
  }
}