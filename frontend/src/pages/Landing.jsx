import React from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Button, 
  Grid, 
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Slide,
  Grow,
  useScrollTrigger,
  Fab,
  Zoom
} from '@mui/material';
import { Link } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';
import CompostIcon from '@mui/icons-material/Compost';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import RecycleIcon from '@mui/icons-material/Recycling';
import ParkIcon from '@mui/icons-material/Park';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

function Landing() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [checked, setChecked] = React.useState(false);
  const [openMissionDialog, setOpenMissionDialog] = React.useState(false);

  const handleMissionOpen = () => {
    setOpenMissionDialog(true);
  };

  const handleMissionClose = () => {
    setOpenMissionDialog(false);
  };

  React.useEffect(() => {
    // Trigger animations when component mounts
    setChecked(true);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box 
        component="section"
        sx={{ 
          bgcolor: 'background.paper',
          pt: { xs: 8, md: 14 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0f2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(46, 125, 50, 0.03) 0%, transparent 25%), radial-gradient(circle at 80% 70%, rgba(46, 125, 50, 0.05) 0%, transparent 25%)',
            zIndex: 0,
          }
        }}
      >
        {/* Animated background elements */}
        <Fade in={checked} timeout={1000}>
          <Box 
            sx={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '40vw',
              height: '40vw',
              maxWidth: '500px',
              maxHeight: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0) 70%)',
              zIndex: 0,
            }}
          />
        </Fade>
        <Fade in={checked} timeout={1500}>
          <Box 
            sx={{
              position: 'absolute',
              bottom: '-15%',
              left: '-10%',
              width: '50vw',
              height: '50vw',
              maxWidth: '600px',
              maxHeight: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(46, 125, 50, 0.08) 0%, rgba(46, 125, 50, 0) 70%)',
              zIndex: 0,
            }}
          />
        </Fade>
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -80, 
            left: -80, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            bgcolor: 'primary.light', 
            opacity: 0.1 
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 2 }}>
          <Slide direction="right" in={checked} timeout={500}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 4, md: 6 }
            }}>
              <Box sx={{ 
                flex: 1, 
                textAlign: { xs: 'center', md: 'left' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' }
              }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                    lineHeight: 1.15,
                    background: 'linear-gradient(45deg, #1b5e20 30%, #4caf50 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: { xs: '50%', md: 0 },
                      transform: { xs: 'translateX(-50%)', md: 'none' },
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(45deg, #1b5e20, #4caf50)',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Shop Sustainable,<br />Save the Planet
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 5,
                    maxWidth: { xs: '100%', md: '90%' },
                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                    lineHeight: 1.7,
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                    opacity: 0.9
                  }}
                >
                  Discover eco-friendly products that help reduce your carbon footprint and earn <strong>EcoCoins</strong> with every purchase. Make a difference with every order!
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button 
                    component={Link} 
                    to="/login" 
                    variant="contained" 
                    size="large"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      px: 5,
                      py: 1.5,
                      borderRadius: '50px',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #2e7d32 0%, #4caf50 100%)',
                      boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(46, 125, 50, 0.4)',
                        background: 'linear-gradient(45deg, #1b5e20 0%, #2e7d32 100%)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Shop now
                  </Button>
                  <Button 
                    onClick={handleMissionOpen}
                    variant="outlined" 
                    size="large"
                    color="primary"
                    startIcon={<EnergySavingsLeafIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      borderWidth: '2px',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderWidth: '2px',
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(46, 125, 50, 0.05)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Our Mission
                  </Button>
                  
                  {/* Mission Dialog */}
                  <Dialog
                    open={openMissionDialog}
                    onClose={handleMissionClose}
                    aria-labelledby="mission-dialog-title"
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        border: '1px solid rgba(46, 125, 50, 0.1)'
                      }
                    }}
                  >
                    <DialogTitle id="mission-dialog-title" sx={{ 
                      m: 0, 
                      p: 3,
                      background: 'linear-gradient(45deg, #2e7d32 0%, #4caf50 100%)',
                      color: 'white',
                      position: 'relative',
                      '& .MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EnergySavingsLeafIcon />
                          Our Mission
                        </Typography>
                        <IconButton
                          aria-label="close"
                          onClick={handleMissionClose}
                          sx={{
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 4 }}>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <EnergySavingsLeafIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>
                          This project is an independent, hackathon-built Amazon extension designed for Amazon HackOn, 
                          aimed at making sustainable shopping seamless, rewarding, and impactful.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
                          We believe in creating a greener future by encouraging eco-conscious shopping habits 
                          and rewarding users for making sustainable choices. Our platform helps you track your 
                          environmental impact while enjoying the benefits of your eco-friendly purchases.
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.dark' }}>
                          Why Choose Eco-Friendly Products?
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li style={{ marginBottom: 8 }}>♻️ Reduce your carbon footprint</li>
                          <li style={{ marginBottom: 8 }}>🌱 Support sustainable practices</li>
                          <li style={{ marginBottom: 8 }}>💧 Conserve natural resources</li>
                          <li>🌍 Help protect our planet for future generations</li>
                        </ul>
                      </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
                      <Button 
                        onClick={handleMissionClose}
                        variant="contained" 
                        color="primary"
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #2e7d32 0%, #4caf50 100%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1b5e20 0%, #2e7d32 100%)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Got it!
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
                
                {/* Trust indicators */}
                <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {[
                    { icon: <RecycleIcon color="success" sx={{ fontSize: 28 }} />, text: '100% Sustainable' },
                    { icon: <ParkIcon color="success" sx={{ fontSize: 28 }} />, text: 'Eco-Friendly' },
                    { icon: <LocalAtmIcon color="success" sx={{ fontSize: 28 }} />, text: 'Earn Rewards' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ 
                flex: { md: 1.2, lg: 1.3 }, 
                position: 'relative', 
                mt: { xs: 6, md: 0 },
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" 
                  alt="A person holding a plant in a jar, representing eco-friendly choices" 
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '450px', md: '600px', lg: '700px' },
                    height: 'auto',
                    borderRadius: '16px',
                    display: 'block',
                    mx: 'auto',
                    filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))',
                    transform: 'translateY(0)',
                    animation: 'float 6s ease-in-out infinite',
                    position: 'relative',
                    zIndex: 1,
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                />
                {/* Decorative elements */}
                <Box 
                  sx={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.05))',
                    top: '10%',
                    right: '10%',
                    zIndex: 0,
                    animation: 'morph 15s ease-in-out infinite',
                    '@keyframes morph': {
                      '0%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
                      '50%': { borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' },
                      '100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Slide>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 700 }}
        >
          Why Shop <span className="eco-gradient-text">Eco-Friendly</span>?
        </Typography>
        
        <Grid 
          container 
          spacing={4} 
          justifyContent="center" 
          alignItems="stretch"
        >
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card 
              className="card-hover" 
              sx={{ 
                height: '100%', 
                width: '100%', 
                maxWidth: 340, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mx: 'auto' 
              }}
            >
              <CardContent 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  height: '100%', 
                  justifyContent: 'center' 
                }}
              >
                <CompostIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Eco-Friendly Products
                </Typography>
                <Typography variant="body1">
                  Discover products that are better for the environment and help reduce your carbon footprint with every purchase.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card 
              className="card-hover" 
              sx={{ 
                height: '100%', 
                width: '100%', 
                maxWidth: 340, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mx: 'auto' 
              }}
            >
              <CardContent 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  height: '100%', 
                  justifyContent: 'center' 
                }}
              >
                <SpaIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Carbon Tracking
                </Typography>
                <Typography variant="body1">
                  Track the positive environmental impact of your shopping choices and see the difference you're making.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card 
              className="card-hover" 
              sx={{ 
                height: '100%', 
                width: '100%', 
                maxWidth: 340, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mx: 'auto' 
              }}
            >
              <CardContent 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  height: '100%', 
                  justifyContent: 'center' 
                }}
              >
                <LocalAtmIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  EcoCoin Rewards
                </Typography>
                <Typography variant="body1">
                  Earn EcoCoins with every purchase that can be redeemed for discounts, cashback, and exclusive rewards.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Call to action */}
        <Box 
          sx={{ 
            mt: 8, 
            py: 5, 
            px: isSmallScreen ? 2 : 8, 
            bgcolor: 'primary.main',
            borderRadius: 4,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Sustainable Shopping Journey?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join thousands of eco-conscious shoppers making a difference one purchase at a time.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/login"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              color: 'white'
            }}
          >
            Shop Now
          </Button>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 12, mb: 6 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                margin: '20px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
            {[
              {
                question: 'What are EcoCoins and how do I earn them?',
                answer: 'EcoCoins are rewards you earn by making sustainable purchases on our platform. For every ₹100 you spend on eco-friendly products, you\'ll earn 10 EcoCoins. These can be redeemed for discounts on future purchases, exclusive products, or even donated to environmental causes.'
              },
              {
                question: 'How do you calculate my environmental impact?',
                answer: 'We calculate your environmental impact based on the products you purchase. Each product in our store has been assessed for its carbon footprint, water usage, and plastic waste reduction compared to conventional alternatives. Your dashboard tracks the cumulative positive impact of all your purchases.'
              },
              {
                question: 'Are all products on your platform 100% eco-friendly?',
                answer: 'While we strive to offer the most sustainable options available, we believe in progress over perfection. We carefully vet all products to ensure they meet strict environmental and ethical standards. Each product page includes detailed information about its sustainability credentials.'
              },
              {
                question: 'How can I track my order and delivery?',
                answer: 'Once your order is placed, you\'ll receive a confirmation email with tracking information. You can also check the status of your orders in the "My Orders" section of your dashboard. We work with carbon-neutral shipping partners to minimize the environmental impact of delivery.'
              },
              {
                question: 'What is your return and refund policy?',
                answer: 'We offer a 30-day return policy for most items. Products must be in their original condition. For hygiene reasons, certain items may not be eligible for return. We aim to process all returns within 5-7 business days. Please contact our customer service team for assistance with returns.'
              },
              {
                question: 'How can I contact customer support?',
                answer: 'Our customer support team is available Monday through Friday from 9 AM to 6 PM IST. You can reach us via email at support@ecoshop.com or through the contact form on our website. We typically respond to all inquiries within 24 hours.'
              }
            ].map((faq, index) => (
              <Accordion 
                key={index} 
                elevation={2}
                sx={{ 
                  mb: 2,
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                  '&:before': {
                    display: 'none'
                  },
                  '&.Mui-expanded': {
                    my: 2
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-${index}-content`}
                  id={`faq-${index}-header`}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    },
                    '&.Mui-expanded': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white' }}>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          
          <Box textAlign="center" mt={6}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Still have questions?
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              to="/contact"
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              Contact Our Support Team
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Scroll to top button */}
      <ScrollTop>
        <Fab 
          color="primary" 
          size="small" 
          aria-label="scroll back to top"
          sx={{
            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
}

export default Landing;