---
layout: post
title: "Common misconceptions about plastic bank cards"
language: english
date: 2011-03-27 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/03/common-misconceptions-about-plastic.html
categories: 
- english
---
Having more than ten years of experience working in banking, in particular with electronic payments, with the help of colleagues I've created a mini FAQ about plastic bank cards. Some questions are obvious, but some can be quite vague.

Thus, there are ten common misconceptions.

1\. The amount of money stored on the card.

On regular credit or debit cards (even having a chip) there is no money counter. The card is just an identifier. There are exceptions in the form of additional wallet applications on the chip cards. Usually it can be discount or loyalty programs, virtual money (for instance, petrol liters) etc. In general this is not related to the normal card usage. Such applications are usually accepted in special stores that only support these cards.

2\. Anyone, who wants to accept the plastic cards, can be connected directly to Visa, MasterCard or to other international payment networks.

It's not possible for just anyone to connect directly to Visa or MasterCard. Only major banks or independent processing centers can do it because it requires special equipment, considerable insurance accounts, security certification and lots of other "little things". Furthermore not every bank can afford it. All others wishing to take cards use their services.

3\ ATMs or POS terminals are connected directly to Visa or MasterCard.

Major international payment networks do not have their own ATMs or payment terminals. ATMs or POS terminals must belong to a bank, which, in turn, is either directly or indirectly (see #2) connected to the payment network.

4\. I have $200 "on the card". That's all that I can spend.

The card balance and the amount you can spend daily using the card are not entirely related to each other. It is more constructive discussing the daily limit on the card. The daily limit depends on many factors, and can be either less than the card balance or even greater. For example, even having one million on the account, you may not be allowed to withdraw more than a few thousand in cash a day at the ATM (and this is not an ATM hardware limitation). And vice versa, if you are a VIP customer, usually having millions in the bank, but at the moment you've lost everything in a casino, after the call to the bank, individually, some of the top managers can give the command to increase your daily limit allowing you to pay off. In this situation the bank takes all the responsibility that you will return everything back.

5\. ATM or POS terminals validate the PIN.

In the overwhelming number of cases, any use of the card refers to a connection with the bank that issued the card. If you insert a card issued by HSBC UK in Australia, an approval to withdraw money will be requested from the HSBC UK anyway right before your eyes. This is because the PIN can be verified only by the bank that issued the card. The only exceptions are cards with a chip. Such cards can verify the PIN without connecting to the bank. These cards are microcomputers able to calculate crypto functions. Sometimes when making a purchase (not cash withdraw), a store may not connect to the bank when a non-chip card is being used if the amount is less than a certain limit. The reason for this is the transactional and communication costs. When the amount is not significant the risk of loss after possible fraud is also not significant.

6\. The PIN is stored on the magnetic stripe and any bank or store employee can "steal" it when holding your card while you turn away.

In fact, there is only a crypto convolution of the PIN recorded on the magnetic stripe, and it is calculated using a crypto key stored in a bank HSM (high security module). Using data from the magnetic stripe can only verify the PIN, and only if you know the secret key. Usually the 3DES algorithm is used. HSM is a hardware device for storing keys and cryptographic operations using those keys. After initial input of keys to HSM (personalization) they are never sent outside the physical case of HSM in the plain form.

In addition to the major effort for the physical protection of these devices, they themselves are protected from an unauthorized intrusion. For example, if you try to open the case connecting a "sniffer", all the keys will be automatically erased.

There is an interesting technique of primary keys input. For example, here is a realistic scenario. We choose N security officers of the bank, for example 3 (ideally, they shouldn't know each other personally). Each officer generates a key and doesn't show it to anyone else. Then, they in turn go into the room with HSM and enter their keys. After all the keys are entered, the HSM computes bitwise XOR amongst them and keeps the result as the master key. It turns out that nobody knows that master key at all. To restore the master key you have to know all original components from those N security officers, who must take care of keeping it secret.

There are no "unimportant" questions in the security, and such procedures are mandatory when the power of cryptography ends and the human factor starts.

This is very important: nobody from the bank staff, ever, under any circumstances will ask you the PIN. However, you cannot imagine how often countless customers, when being asked by the bank operator the security question say the PIN.

7\. When making the purchase, money immediately comes directly from the customer's account to the account of the merchant.

Usually clearing happens in the end of the business day. When making the purchase the amount from the available day limit (see #4) is only taken on hold. The account is debited a few days later when the bank issued the card receives the financial representation from the bank that accepted the card and processed the payment (bank-acquirer).

8\. The amount, printed on your receipt when paying by card, is precisely what will be deducted from your account. 

In fact, the authorized amount may differ significantly from the amount that was withdrawn by the financial transaction. It often happens in car rentals and hotels. Such merchants are allowed to charge extras (for example, for petrol and minibar). And these are not the only type of merchants allowed to adjust the final amount.

Also the amount taken on hold on purchase and the amount eventually withdrawn from the account can differ if the account currency is different to the transaction currency. Clearing usually takes a few days but the exchange rate could change in this time.

9\. The amount, taken on hold when paying by card, will be withdrawn from the account anyway.

The amount on hold may be never debited from the account. After 10 (for ATM) or 45 (for other types of terminals) days, if there is no financial representation received from the bank-acquirer, the hold will be lifted. This is "good" and "bad". It is "good" if you have just paid but want to cancel. You can contact your bank immediately, explain the reason for the cancellation, and if everything is okay with the payment, the operator cancels the transaction and the hold disappears. In this case if your bank receives a financial representation of this payment from the merchant (in a few days period) the bank will be dealing with this problem without you (and your money). It is "bad" if you waited a couple of days and the financial representation has been delivered before your call. In this case it will be much harder to cancel the transaction and get your money back. The bank will have to start an investigation, which can take up to 45 days. Meanwhile that amount will still be on hold.

10\. Debit card users cannot go to overdraft.

As explained in #4, the purchase authorization logic is not based on the account balance, but on the daily limits. And it works similarly for debit and credit cards. The bank can adjust the daily limit, slightly exceeding the account balance, even for debit cards. 

Hope all this information will help you avoid some unpleasant surprises when using plastic cards.
