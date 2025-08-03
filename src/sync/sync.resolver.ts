// Sync resolver for premium users
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PremiumGuard } from '../auth/premium.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SyncService, SyncData } from './sync.service';

@Resolver()
export class SyncResolver {
  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async upgradeToPremium(
    @CurrentUser() user: any,
    @Args('subscriptionType') subscriptionType: string,
    @Args('paymentMethod') paymentMethod: string,
  ): Promise<string> {
    // Simulate payment processing
    const paymentResult = await this.processPayment(paymentMethod, subscriptionType);
    
    if (!paymentResult.success) {
      throw new Error(`Payment failed: ${paymentResult.message}`);
    }

    const result = await this.syncService.upgradeToPremium(user.userId, subscriptionType);
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return 'Successfully upgraded to premium';
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PremiumGuard)
  async syncUserData(
    @CurrentUser() user: any,
    @Args('data') data: string, // JSON string of sync data
  ): Promise<string> {
    try {
      const syncData: SyncData = JSON.parse(data);
      const result = await this.syncService.syncUserData(user.userId, syncData);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return 'Data synchronized successfully';
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard, PremiumGuard)
  async getUserSyncData(@CurrentUser() user: any): Promise<string> {
    const syncData = await this.syncService.getUserSyncData(user.userId);
    return JSON.stringify(syncData);
  }

  private async processPayment(paymentMethod: string, subscriptionType: string): Promise<{ success: boolean; message: string }> {
    // Simulate payment processing for different methods
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    // Simulate different payment scenarios
    const random = Math.random();
    
    if (random < 0.1) { // 10% failure rate for simulation
      return {
        success: false,
        message: 'Payment declined. Please try a different payment method.'
      };
    }

    // Simulate successful payment processing
    switch (paymentMethod) {
      case 'google_pay':
        return {
          success: true,
          message: 'Payment processed successfully via Google Pay'
        };
      case 'apple_pay':
        return {
          success: true,
          message: 'Payment processed successfully via Apple Pay'
        };
      case 'paypal':
        return {
          success: true,
          message: 'Payment processed successfully via PayPal'
        };
      case 'card':
        return {
          success: true,
          message: 'Payment processed successfully via Credit Card'
        };
      default:
        return {
          success: false,
          message: 'Unsupported payment method'
        };
    }
  }
}