# EmailJS Setup Instructions

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# EmailJS Configuration for Contact Form
# Get these from https://www.emailjs.com/
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Base URL for your application
NEXTAUTH_URL=https://bespokecarat.com
```

## EmailJS Setup Steps

1. **Create an EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account

2. **Create a Service**
   - Add an email service (Gmail, Outlook, etc.)
   - Note down the Service ID

3. **Create a Template**
   - Create an email template with the following variables:
     - `{{name}}` - Customer name
     - `{{email}}` - Customer email
     - `{{phone_number}}` - Customer phone
     - `{{enquiry_type}}` - Type of inquiry
     - `{{time}}` - Timestamp (Hong Kong timezone)
     - `{{subject}}` - Subject line
     - `{{message}}` - Customer message
     - `{{photos_urls}}` - List of photo URLs

4. **Get Your Public Key**
   - Go to Account settings -> API Keys
   - Copy your Public Key

5. **Update Environment Variables**
   - Add the Service ID, Template ID, and Public Key to your `.env.local` file

## Sample Email Template

```
{{name}}
Email: {{email}}
Phone Number: {{phone_number}}
Enquiry type: {{enquiry_type}}
time: {{time}}

Subject: {{subject}}
{{message}}

Photos: 

{{photos_urls}}
```

## Features

- **Photo Attachments**: Users can upload up to 5 photos (10MB each)
- **Unique Naming**: Photos are saved with UUID names in `public/enquiry/`
- **Direct Links**: Photo URLs are included in the email
- **Success Feedback**: Users see confirmation when email is sent
- **Error Handling**: Proper error messages for upload/send failures
