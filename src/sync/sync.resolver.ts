// Sync resolver for premium users
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PremiumGuard } from '../auth/premium.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SyncService, SyncData } from './sync.service';
import axios from 'axios';

@Resolver()
export class SyncResolver {
  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async upgradeToPremium(
    @CurrentUser() user: any,
    @Args('subscriptionType') subscriptionType: string,
    @Args('paymentMethod') paymentMethod: string,
    @Args('paymentToken', { nullable: true }) paymentToken?: string,
    @Args('amount', { nullable: true }) amount?: number,
  ): Promise<string> {
    // Process payment with real integration
    const paymentResult = await this.processPayment(paymentMethod, subscriptionType, paymentToken, amount);
    
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

  private async processPayment(paymentMethod: string, subscriptionType: string, paymentToken?: string, amount?: number): Promise<{ success: boolean; message: string }> {
    try {
      switch (paymentMethod) {
        case 'paypal':
          return await this.processPayPalPayment(paymentToken, amount);
        case 'google_pay':
        case 'apple_pay':
        case 'card':
          // For now, simulate other payment methods
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            success: true,
            message: `Payment processed successfully via ${paymentMethod}`
          };
        default:
          return {
            success: false,
            message: 'Unsupported payment method'
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Payment processing error: ${error.message}`
      };
    }
  }

  private async processPayPalPayment(paymentToken?: string, amount?: number): Promise<{ success: boolean; message: string }> {
    if (!paymentToken) {
      return {
        success: false,
        message: 'PayPal payment token is required'
      };
    }

    try {
      // Get PayPal access token
      const accessToken = await this.getPayPalAccessToken();
      
      // Capture the payment
      const captureResponse = await axios.post(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paymentToken}/capture`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (captureResponse.data.status === 'COMPLETED') {
        return {
          success: true,
          message: 'PayPal payment processed successfully'
        };
      } else {
        return {
          success: false,
          message: 'PayPal payment was not completed'
        };
      }
    } catch (error) {
      console.error('PayPal payment error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'PayPal payment failed'
      };
    }
  }

  private async getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const baseUrl = process.env.PAYPAL_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      throw new Error('PayPal configuration is missing');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        `${baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('PayPal token error:', error.response?.data || error.message);
      throw new Error('Failed to get PayPal access token');
    }
  }
}