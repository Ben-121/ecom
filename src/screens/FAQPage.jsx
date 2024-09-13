import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: "What is your return policy?",
    answer: "You can return most items within 30 days of receipt for a full refund. Some restrictions apply."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and link."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to many countries worldwide. Please check our shipping policy for more details."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and Apple Pay."
  },
  {
    question: "How do I contact customer service?",
    answer: "You can reach our customer service team via email at support@example.com or by phone at 1-800-123-4567."
  },
  {
    question: "Can I change or cancel my order after it's been placed?",
    answer: "If you need to make changes to your order, please contact us as soon as possible. We can only make changes before the order has been processed."
  },
  {
    question: "How do I use a discount code?",
    answer: "Enter your discount code at checkout in the 'Discount Code' field."
  },
];

function FAQPage() {
  const handleContactUs = () => {
    window.location.href = "/contact";
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions
      </Typography>

      {faqs.map((faq, index) => (
        <Accordion key={index} sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography variant="h6">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Typography variant="body1">
          If you still have questions or need further assistance, please don't hesitate to reach out to our
          <Button variant="contained" color="primary" onClick={handleContactUs} sx={{ marginLeft: 1 }}>
            Contact Us
          </Button>
          page.
        </Typography>
      </Box>
    </Container>
  );
}

export default FAQPage;
