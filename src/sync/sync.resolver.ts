// Sync resolver for premium users
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PremiumGuard } from '../auth/premium.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SyncService, SyncData } from './sync.service';
import { UpgradePremiumInput } from './dto/upgrade-premium.input';
import axios from 'axios';

@Resolver()
export class SyncResolver {
  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async upgradeToPremium(
    @CurrentUser() user: any,
    @Args('input') input: UpgradePremiumInput,
  ): Promise<string> {
    console.log('🚀 Backend: Recibida solicitud upgradeToPremium');
    console.log('👤 Usuario ID:', user.userId);
    console.log('📦 Tipo de suscripción:', input.subscriptionType, 'Tipo:', typeof input.subscriptionType);
    console.log('💳 Método de pago:', input.paymentMethod, 'Tipo:', typeof input.paymentMethod);
    console.log('🎫 Token de pago:', input.paymentToken, 'Tipo:', typeof input.paymentToken);
    console.log('💰 Monto:', input.amount, 'Tipo:', typeof input.amount);
    console.log('🔍 Argumentos recibidos completos:', input);
    
    // Process payment with real integration
    console.log('🔄 Iniciando procesamiento de pago...');
    const paymentResult = await this.processPayment(input.paymentMethod, input.subscriptionType, input.paymentToken, input.amount);
    
    console.log('✅ Resultado del procesamiento de pago:', paymentResult);
    
    if (!paymentResult.success) {
      console.error('❌ Error en el procesamiento de pago:', paymentResult.message);
      throw new Error(`Payment failed: ${paymentResult.message}`);
    }

    console.log('🔄 Actualizando usuario a premium...');
    const result = await this.syncService.upgradeToPremium(user.userId, input.subscriptionType);
    
    console.log('✅ Resultado de actualización a premium:', result);
    
    if (!result.success) {
      console.error('❌ Error al actualizar a premium:', result.message);
      throw new Error(result.message);
    }

    console.log('🎉 Usuario actualizado a premium exitosamente');
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
    console.log('💳 Backend: Iniciando validación de PayPal');
    console.log('💳 Token recibido:', paymentToken);
    console.log('💳 Monto:', amount);
    
    if (!paymentToken) {
      console.error('💳 ❌ Token de PayPal no proporcionado');
      return {
        success: false,
        message: 'PayPal payment token is required'
      };
    }

    try {
      console.log('💳 🔄 Obteniendo access token de PayPal...');
      // Get PayPal access token
      const accessToken = await this.getPayPalAccessToken();
      console.log('💳 ✅ Access token obtenido exitosamente');
      
      console.log('💳 🔄 Capturando pago en PayPal...');
      console.log('💳 URL de captura:', `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paymentToken}/capture`);
      
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

      console.log('💳 📋 Respuesta de PayPal:', JSON.stringify(captureResponse.data, null, 2));
      console.log('💳 📊 Status de la respuesta:', captureResponse.data.status);

      if (captureResponse.data.status === 'COMPLETED') {
        console.log('💳 ✅ Pago de PayPal completado exitosamente');
        return {
          success: true,
          message: 'PayPal payment processed successfully'
        };
      } else {
        console.error('💳 ❌ Pago de PayPal no completado. Status:', captureResponse.data.status);
        return {
          success: false,
          message: `PayPal payment was not completed. Status: ${captureResponse.data.status}`
        };
      }
    } catch (error) {
      console.error('💳 ❌ Error en validación de PayPal:');
      console.error('💳 ❌ Error message:', error.message);
      console.error('💳 ❌ Error response:', error.response?.data);
      console.error('💳 ❌ Error status:', error.response?.status);
      console.error('💳 ❌ Error stack:', error.stack);
      return {
        success: false,
        message: `PayPal payment failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  private async getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const baseUrl = process.env.PAYPAL_BASE_URL;

    console.log('🔑 Verificando configuración de PayPal...');
    console.log('🔑 Client ID configurado:', !!clientId);
    console.log('🔑 Client Secret configurado:', !!clientSecret);
    console.log('🔑 Base URL:', baseUrl);

    if (!clientId || !clientSecret || !baseUrl) {
      console.error('🔑 ❌ Configuración de PayPal incompleta');
      throw new Error('PayPal configuration is missing');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    console.log('🔑 🔄 Solicitando access token a PayPal...');

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

      console.log('🔑 ✅ Access token obtenido de PayPal');
      return response.data.access_token;
    } catch (error) {
      console.error('🔑 ❌ Error al obtener access token de PayPal:');
      console.error('🔑 ❌ Error message:', error.message);
      console.error('🔑 ❌ Error response:', error.response?.data);
      console.error('🔑 ❌ Error status:', error.response?.status);
      throw new Error(`Failed to get PayPal access token: ${error.response?.data?.error_description || error.message}`);
    }
  }
}