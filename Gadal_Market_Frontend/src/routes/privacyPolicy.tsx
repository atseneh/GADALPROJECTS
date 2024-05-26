import { Box, Stack, Typography } from "@mui/material";

export default function PrivacyPolicy(){
    return (
      <Stack
      spacing={1}
      sx={{
        p:1,
        pl:4
      }}
      >
    <Box
    sx={{
        alignSelf:'center'
    }}
    >
        <img
        alt="logo"
        src='/mobileLogo.svg'
        />
    </Box>
     <Typography
     variant="h5"
     textAlign={'center'}
     >
        Gadal Market Privacy Policy
    </Typography>
   <Typography
   fontWeight={'bold'}
   >
     1. Information we Collect
    </Typography>  
    <ul
    
    >
         <Typography>
         <span style={{fontWeight:'bold'}}>1.1</span> Personal Information: When you register an account, post an ad, or engage
        in transactions on our site, we may collect personal information such as your name,
        email address, and phone number.
         </Typography>
         <br/>  
         <Typography>
         <span style={{fontWeight:'bold'}}>1.2</span> Ad Posting Information: We collect information related to the ads you post on
            our platform, including item details, descriptions, photos, and pricing information.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>1.3</span> Transaction Information: If you engage in transactions with other users, we
        may collect information related to those transactions, including payment details and
        communication records.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>1.4</span> Usage Information: We gather data about how you interact with our site,
        including your browsing activity, search queries, and device information.
         </Typography>
    </ul>
    <Typography
   fontWeight={'bold'}
   >
     2. How We Use Your Information:
    </Typography>  
     <ul>
     <Typography>
         <span style={{fontWeight:'bold'}}>2.1</span> To Provide Services: We use your information to provide and improve our
services, including facilitating transactions, processing payments, and delivering
customer support
         </Typography>
         <br/>  
         <Typography>
         <span style={{fontWeight:'bold'}}>2.2</span> To Customize User Experience: We may personalize your experience on our
site by showing relevant ads, recommendations, and content based on your
preferences and browsing history.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>2.3</span> To Communicate with You: We may use your contact information to send you
notifications, updates, promotional offers, and important messages related to your
account or transactions.

         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>2.4</span> To Ensure Security: We utilize your information to detect and prevent
fraudulent activities, unauthorized access, and other security risks.

         </Typography>

     </ul>
     <Typography
   fontWeight={'bold'}
   >
     3. Information Sharing and Disclosure:
    </Typography>  
     <ul>
     <Typography>
         <span style={{fontWeight:'bold'}}>3.1</span> With Other Users: Certain information, such as your contact details and ad
postings, may be shared with other users on our platform as necessary to facilitate
transactions and communications.
         </Typography>
         <br/>  
         <Typography>
         <span style={{fontWeight:'bold'}}>3.2</span> With Service Providers: We may share your information with third-party service
providers who assist us in operating our platform, processing payments, or providing
other services on our behalf.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>3.3</span> For Legal Compliance: We may disclose your information to comply with
applicable laws, regulations, legal processes, or governmental requests.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>3.4</span> In Case of Business Transfer: If our business undergoes a merger, acquisition, or
sale of assets, your information may be transferred as part of the transaction, subject to
confidentiality agreements and legal requirements.

         </Typography>

     </ul>
     <Typography
   fontWeight={'bold'}
   >
     4. Data Retention:
    </Typography>  
    <ul>
        <Typography>
        We retain your information for as long as necessary to fulfill the purposes outlined in this
        Privacy Policy, unless a longer retention period is required or permitted by law.

        </Typography>
    </ul>
    <Typography
   fontWeight={'bold'}
   >
     5. Your Privacy Choices:
    </Typography>  
     <ul>
     <Typography>
         <span style={{fontWeight:'bold'}}>5.1</span> Account Settings: You can manage your account settings and privacy
preferences by accessing your account dashboard on our platform.
         </Typography>
         <br/>  
         <Typography>
         <span style={{fontWeight:'bold'}}>5.2</span> Opt-Out: You have the option to opt-out of certain communications,
promotional offers, and personalized ads by adjusting your notification settings or
contacting us directly.
         </Typography>
         <br/>
         <Typography>
         <span style={{fontWeight:'bold'}}>5.3</span> Access and Correction: You may request access to or correction of your
personal information by contacting us using the information provided at the end of this
Privacy Policy.
         </Typography>
     </ul>
     <Typography
   fontWeight={'bold'}
   >
     6. Security Measures:
    </Typography>  
    <ul>
        <Typography>
        We implement appropriate technical and organizational measures to protect your
information against unauthorized access, disclosure, alteration, or destruction.

        </Typography>
    </ul>
    <Typography
   fontWeight={'bold'}
   >
     7.  Children's Privacy:
    </Typography>  
    <ul>
        <Typography>
    Our platform is not intended for use by individuals under the age of 18. We do not
knowingly collect or solicit personal information from children, and if we become aware
that we have inadvertently collected such information, we will take steps to delete it
        </Typography>
    </ul>
    <Typography
   fontWeight={'bold'}
   >
     8. Changes to this Privacy Policy:
    </Typography>  
    <ul>
        <Typography>
        We may update this Privacy Policy periodically to reflect changes in our practices or
legal requirements. We will notify you of any material updates by posting a revised
version on our site or contacting you directly.
        </Typography>
    </ul>
    <Typography
   fontWeight={'bold'}
   >
     9. Contact Us:
    </Typography>  
    <ul>
        <Typography>
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at :-
        </Typography>
        <br/>
        <Typography>
          Phone : +2519 11 22 93 61
        </Typography>
        <br/>
        <Typography>
          Call Center : 9830
        </Typography>
        <br/>
        <Typography>
          Email : contact@gadalmarket.com
        </Typography>
    </ul>
    <br/>
    <Typography>
        Effective Date: May 1, 2024
        </Typography>
      </Stack>
    )
}