# Guide d'Intégration Mobile Money (MTN / Orange)

Ce projet utilise actuellement un service simulé (`services/paymentService.ts`). Pour passer en production, suivez ce guide.

## 1. MTN Mobile Money (MoMo API)

### Prérequis
- Créer un compte développeur sur https://momodeveloper.mtn.com/
- Obtenir `API User`, `API Key`, `Subscription Key`.

### Flow (Collection)
1. **Request to Pay**: Le backend envoie une requête POST à l'API MTN.
2. **Validation**: L'utilisateur reçoit un pop-up USSD pour entrer son PIN.
3. **Callback/Webhook**: MTN notifie votre serveur du statut de la transaction.

### Exemple de code (Backend Edge Function recommended)
```typescript
const requestToPay = async (phone, amount, id) => {
  const token = await getMomoToken();
  await axios.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
    amount: amount,
    currency: "XAF",
    externalId: id,
    payer: { partyIdType: "MSISDN", partyId: phone },
    payerMessage: "Paiement DschangMarket",
    payeeNote: "Merci"
  }, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': uuid(),
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
    }
  });
}
```

## 2. Orange Money Web Payment

### Prérequis
- Compte marchand Orange Money Cameroun.

### Flow
1. **Initialisation**: Appeler l'API Orange `mp/init` pour obtenir un `pay_token`.
2. **Redirection**: Rediriger l'utilisateur vers la page de paiement sécurisée Orange ou déclencher un USSD Push si l'API le permet.
3. **Check Status**: Vérifier le statut de la transaction via l'API.

## 3. Sécurité & Best Practices
- Ne jamais stocker les clés API côté client (Frontend).
- Utiliser les Supabase Edge Functions pour encapsuler les appels de paiement.
- Vérifier la signature des webhooks pour éviter la fraude.
