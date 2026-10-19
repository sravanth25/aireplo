export type Template = {
  id: string
  name: string
  category: 'Marketing' | 'Utility' | 'Authentication'
  industry: string
  body: string
  sample: string[]
  buttons?: string[]
}

// Message templates in Meta's {{1}} variable format.
export const templates: Template[] = [
  { id: 'festive', name: 'Festive sale', category: 'Marketing', industry: 'Retail', body: 'Hi {{1}} 🎉 Our {{2}} Sale is live! Get flat {{3}} off on everything till {{4}}. Don’t miss out 👇', sample: ['Priya', 'Diwali', '40%', 'Sunday'], buttons: ['Shop now'] },
  { id: 'cart', name: 'Abandoned cart', category: 'Marketing', industry: 'E-commerce', body: 'Hi {{1}}, you left {{2}} in your cart 🛒 Complete your order in the next 24 hours and get {{3}} off with code *{{4}}*.', sample: ['Rahul', 'Running Shoes', '10%', 'COMEBACK10'], buttons: ['Complete order'] },
  { id: 'arrival', name: 'New arrivals', category: 'Marketing', industry: 'Fashion', body: 'Hi {{1}} ✨ Our new {{2}} collection just dropped. Be the first to shop before it sells out!', sample: ['Ananya', 'summer'], buttons: ['View collection'] },
  { id: 'winback', name: 'We miss you', category: 'Marketing', industry: 'Any', body: 'We miss you, {{1}}! 💚 It’s been a while since your last visit. Here’s {{2}} off your next order, valid till {{3}}.', sample: ['Karan', '₹200', '30 Nov'], buttons: ['Claim offer'] },
  { id: 'webinar', name: 'Event invite', category: 'Marketing', industry: 'Education', body: 'Hi {{1}}, you’re invited to our free live session *{{2}}* on {{3}} at {{4}}. Seats are limited — reserve yours now.', sample: ['Sneha', 'Crack NEET in 90 Days', '25 Oct', '7 PM'], buttons: ['Reserve seat'] },
  { id: 'referral', name: 'Refer a friend', category: 'Marketing', industry: 'Any', body: 'Love {{1}}, {{2}}? Share your code *{{3}}* with friends. They get {{4}} off and you get the same on your next order 🎁', sample: ['Chai Point', 'Vikram', 'VIKRAM50', '₹50'], buttons: ['Share code'] },
  { id: 'order', name: 'Order confirmed', category: 'Utility', industry: 'E-commerce', body: 'Hi {{1}}, thanks for your order! 🎉 Order *{{2}}* of {{3}} is confirmed and will be delivered by {{4}}.', sample: ['Meera', '#4821', '₹1,499', '24 Oct'], buttons: ['Track order'] },
  { id: 'shipped', name: 'Order shipped', category: 'Utility', industry: 'E-commerce', body: 'Good news, {{1}}! 🚚 Your order {{2}} has been shipped via {{3}}. Tracking number: {{4}}.', sample: ['Arjun', '#4821', 'Delhivery', 'DL83920144'], buttons: ['Track shipment'] },
  { id: 'cod', name: 'COD confirmation', category: 'Utility', industry: 'E-commerce', body: 'Hi {{1}}, please confirm your Cash on Delivery order {{2}} of {{3}}. Unconfirmed orders are cancelled after 24 hours.', sample: ['Pooja', '#4821', '₹899'], buttons: ['Confirm order', 'Cancel order'] },
  { id: 'payment', name: 'Payment reminder', category: 'Utility', industry: 'Services', body: 'Hi {{1}}, a gentle reminder that your payment of {{2}} for invoice {{3}} is due on {{4}}.', sample: ['Suresh', '₹12,000', 'INV-2041', '30 Oct'], buttons: ['Pay now'] },
  { id: 'appointment', name: 'Appointment reminder', category: 'Utility', industry: 'Healthcare', body: 'Hi {{1}}, this is a reminder of your appointment with {{2}} on {{3}} at {{4}}. Reply YES to confirm or call us to reschedule.', sample: ['Mr. Rao', 'Dr. Iyer', '22 Oct', '11:30 AM'], buttons: ['Confirm', 'Reschedule'] },
  { id: 'feedback', name: 'Feedback request', category: 'Utility', industry: 'Any', body: 'Hi {{1}}, how was your experience with {{2}}? Your feedback takes 30 seconds and helps us improve 🙏', sample: ['Neha', 'your recent order'], buttons: ['Great', 'Okay', 'Not good'] },
  { id: 'admission', name: 'Admission follow-up', category: 'Utility', industry: 'Education', body: 'Hi {{1}}, thank you for your enquiry about {{2}}. Our counsellor {{3}} will call you on {{4}}. Reply here with any questions.', sample: ['Aditya', 'B.Tech CSE', 'Ms. Kavya', 'Monday'] },
  { id: 'otp', name: 'Login OTP', category: 'Authentication', industry: 'Any', body: '*{{1}}* is your verification code. For your security, do not share this code.', sample: ['482913'], buttons: ['Copy code'] },
]

export function fillTemplate(body: string, values: string[]) {
  return body.replace(/\{\{(\d+)\}\}/g, (_, n) => values[Number(n) - 1] ?? `{{${n}}}`)
}
