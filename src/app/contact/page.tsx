'use client';
import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function ContactPage() {
  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">
          Contact Us
        </h1>
        <Typography variant="body1" gutterBottom>
          Have questions or feedback? Fill out the form below and we'll get back to you soon.
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            margin="normal"
          />
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            margin="normal"
          />
          <TextField
            required
            fullWidth
            label="Message"
            name="message"
            multiline
            rows={4}
            margin="normal"
          />
          <Button
            variant="contained"
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            Send Message
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
}
