# Configuración de PayPal para el Sistema de Pagos

## Configuración del Backend (NestJS)

### 1. Variables de Entorno
Edita el archivo `expenses-backend/.env` y configura las siguientes variables:

```env
# PayPal configuration
PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret_aqui
PAYPAL_MODE=sandbox
PAYPAL_BASE_URL=https://api.sandbox.paypal.com
```

### 2. Obtener Credenciales de PayPal

1. Ve a [PayPal Developer](https://developer.paypal.com/)
2. Inicia sesión con tu cuenta de PayPal
3. Ve a "My Apps & Credentials"
4. En la sección "Sandbox", crea una nueva aplicación
5. Copia el `Client ID` y `Client Secret`
6. Reemplaza los valores en el archivo `.env`

### 3. Para Producción
Cuando estés listo para producción:
- Cambia `PAYPAL_MODE=live`
- Cambia `PAYPAL_BASE_URL=https://api.paypal.com`
- Usa las credenciales de la aplicación de producción

## Configuración del Frontend (Flutter)

### 1. Variables de Entorno
Edita el archivo `cointrol/.env` y configura:

```env
# PayPal configuration
PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui
PAYPAL_MODE=sandbox

# Backend API
API_BASE_URL=http://localhost:3000
GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

### 2. Dependencias Instaladas
Las siguientes dependencias ya están configuradas en `pubspec.yaml`:
- `flutter_paypal_payment: ^1.0.6` - Para integración con PayPal
- `flutter_dotenv: ^5.1.0` - Para manejo de variables de entorno

## Flujo de Pago Implementado

### 1. Frontend (Flutter)
1. Usuario selecciona PayPal como método de pago
2. Se abre la interfaz de PayPal usando `flutter_paypal_payment`
3. Usuario completa el pago en PayPal
4. Se obtiene el token de pago (orderID/paymentId)
5. Se envía al backend para validación

### 2. Backend (NestJS)
1. Recibe el token de pago del frontend
2. Obtiene un access token de PayPal usando Client ID y Secret
3. Valida el pago usando la API de PayPal
4. Si es exitoso, activa la suscripción premium
5. Retorna confirmación al frontend

## Métodos de Pago Soportados

- ✅ **PayPal** - Integración completa con validación en backend
- 🔄 **Google Pay** - Simulado (listo para integración real)
- 🔄 **Apple Pay** - Simulado (listo para integración real)
- 🔄 **Tarjeta de Crédito** - Simulado (listo para integración real)

## Seguridad

- Las credenciales de PayPal se almacenan solo en el backend
- El frontend solo maneja tokens de pago, no información sensible
- Todas las validaciones de pago se realizan en el backend
- Los tokens de pago son de un solo uso

## Testing

### Cuentas de Prueba PayPal
Puedes crear cuentas de prueba en el [PayPal Sandbox](https://developer.paypal.com/developer/accounts/)

### Datos de Prueba
- Email: sb-buyer@personal.example.com
- Password: (generado por PayPal)

## Próximos Pasos

1. **Configurar credenciales reales de PayPal**
2. **Integrar Google Pay** usando `pay` package
3. **Integrar Apple Pay** usando `pay` package
4. **Integrar Stripe** para tarjetas de crédito
5. **Implementar webhooks** para notificaciones de pago
6. **Agregar logging** y monitoreo de transacciones

## Troubleshooting

### Error: "PayPal configuration is missing"
- Verifica que las variables de entorno estén configuradas correctamente
- Reinicia el servidor backend después de cambiar las variables

### Error: "Failed to get PayPal access token"
- Verifica que el Client ID y Secret sean correctos
- Verifica que la URL base sea correcta para tu entorno

### Error: "PayPal payment failed"
- Verifica que el token de pago sea válido
- Revisa los logs del backend para más detalles
- Verifica que la cuenta de PayPal tenga fondos suficientes (en sandbox)