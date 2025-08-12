import React from 'react';
import { Container, Typography, Paper, Box, Avatar, Grid } from '@mui/material';
import priyanshu_pic from '../pages/priyanshu_pic.jpg';
import Ashu_pic from '../pages/Ashu_pic.jpg';
import Jemmut_pic from '../pages/Jemmut_pic.jpg';
import Sruti_pic from '../pages/Sruti_pic.png';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Priyanshu Pal",
      role: "Backend Developer",
      avatar: priyanshu_pic
    },
    {
      name: "Sruti Dash",
      role: "Frontend Developer",
      avatar: Sruti_pic
    },
    {
      name: "Jemmut Patnaik",
      role: "Machine Learning Engineer",
      avatar: Jemmut_pic
    },
    {
      name: "Ashutosh Dash",
      role: "Machine Learning Engineer",
      avatar: Ashu_pic
    }
  ];

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to ECOSTORE, your number one source for all things eco-friendly. We're dedicated to giving you the very best of sustainable products, with a focus on quality, customer service, and uniqueness.
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2024, Eco-Store has come a long way from its beginnings. When we first started out, our passion for a greener planet drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store. 
        </Typography>
        <Typography variant="body1">
        Today’s online shopping platforms often overlook climate action. While sustainable 
products exist, customers lack intelligent recommendations, clear information about 
their environmental impact, and incentives to choose greener options. This gap limits opportunities for eco-friendly packaging choices, rewards for 
sustainable behavior, and participation in green commerce communities. By 
integrating smart tools, personalized suggestions, and meaningful rewards, we can shift 
e-commerce toward a model that values both convenience and sustainability.
        </Typography>
        <Typography variant="body1" paragraph>
        <br></br>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </Typography>

        {/* Team Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Our Team
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      border: '3px solid rgb(134, 236, 137)',
                      boxShadow: '10px 10px 50px rgba(7, 7, 7, 0.1)'
                    }}
                  />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs;
