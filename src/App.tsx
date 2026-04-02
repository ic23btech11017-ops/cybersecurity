import { Box, Button, Chip, Container, Stack, Typography, ThemeProvider, createTheme } from '@mui/material'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const garvinTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0071e3',
      dark: '#0033a0',
      light: '#5ac8fa',
    },
    secondary: {
      main: '#808080',
      dark: '#404040',
      light: '#cccccc',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    divider: '#404040',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    allVariants: {
      letterSpacing: '-0.02em',
      color: '#ffffff',
    },
    h1: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    h2: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    h3: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    h4: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    h5: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    h6: { letterSpacing: '-0.03em', fontWeight: 800, color: '#ffffff' },
    body1: { letterSpacing: '-0.01em', color: '#cccccc' },
    body2: { letterSpacing: '-0.01em', color: '#a6a6a6' },
    button: { letterSpacing: '-0.01em', fontWeight: 600, color: '#ffffff' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          padding: '10px 28px',
          transition: 'all 0.2s ease',
        },
        contained: {
          backgroundColor: '#0071e3',
          color: '#ffffff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#0033a0',
            boxShadow: '0 8px 24px rgba(0, 113, 227, 0.35)',
            transform: 'translateY(-2px)'
          },
          '&:active': {
            backgroundColor: '#002060',
          }
        },
        outlined: {
          borderColor: '#0071e3',
          color: '#ffffff',
          borderWidth: '2px',
          backgroundColor: 'transparent',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#5ac8fa',
            backgroundColor: 'rgba(0, 113, 227, 0.12)',
            transform: 'translateY(-2px)'
          }
        },
        text: {
          color: '#0071e3',
          '&:hover': {
            backgroundColor: 'rgba(0, 113, 227, 0.08)',
            color: '#5ac8fa',
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          color: '#ffffff',
          borderColor: '#404040',
          '&:hover': {
            backgroundColor: '#404040',
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderColor: '#404040',
          boxShadow: '0 0 1px rgba(0, 113, 227, 0.1)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          backgroundImage: 'none',
          borderColor: '#404040',
        }
      }
    }
  }
})

const products = [
  {
    code: 'EDU',
    accent: '#3b82f6',
    title: 'Education Management',
    text: 'A complete school and college operating system — from admissions to alumni, everything in one intelligent platform.',
    tags: ['Fee Collection', 'Biometric Attendance', 'Timetable', 'Library', 'Exams & Results'],
  },
  {
    code: 'HLT',
    accent: '#14b8a6',
    title: 'Healthcare Management',
    text: 'Streamline clinic and hospital operations with smart patient records, automated billing, and pharmacy management.',
    tags: ['Patient Records', 'OPD/IPD', 'Pharmacy', 'Lab Reports', 'Insurance'],
  },
  {
    code: 'ERP',
    accent: '#8b5cf6',
    title: 'Enterprise ERP',
    text: 'Run your entire business — HR, payroll, inventory, procurement, and finance — through one unified control panel.',
    tags: ['HR & Payroll', 'Inventory', 'Accounting', 'CRM', 'Projects'],
  },
  {
    code: 'MFG',
    accent: '#f59e0b',
    title: 'Manufacturing Suite',
    text: 'Production planning, quality control, supply chain visibility and shop-floor automation in a single dashboard.',
    tags: ['Production Planning', 'QC', 'Supply Chain', 'MRP'],
  },
  {
    code: 'RTL',
    accent: '#ef4444',
    title: 'Retail & POS',
    text: 'Smart point-of-sale, inventory sync, GST billing, and customer loyalty — built for modern retail businesses.',
    tags: ['POS Billing', 'Inventory Sync', 'GST Reports', 'Loyalty'],
  },
  {
    code: 'GOV',
    accent: '#0ea5e9',
    title: 'Government & NGO',
    text: 'Transparent, compliant, and citizen-centric software for government departments and non-profit organisations.',
    tags: ['Citizen Records', 'Compliance', 'Budget Tracking', 'Grants'],
  },
]

const features = [
  { code: 'AI', accent: '#2563eb', title: 'Gen AI Automation', text: 'Intelligent workflows that learn from your data, auto-draft reports, flag anomalies, and surface insights before you ask.' },
  { code: 'BI', accent: '#0ea5e9', title: 'Real-Time Analytics', text: 'Live dashboards with role-based views — executives see the big picture, teams see their tasks. All data, always current.' },
  { code: 'CLD', accent: '#14b8a6', title: 'Cloud-First Platform', text: 'Access from any device, anywhere. Zero infrastructure to manage. Auto-backups, 99.9% uptime SLA, and bank-grade security.' },
  { code: 'APP', accent: '#6366f1', title: 'Mobile App Support', text: 'Native mobile experience for staff and stakeholders — approve requests, view reports, and manage tasks on the go.' },
  { code: 'API', accent: '#8b5cf6', title: 'Third-Party Integrations', text: 'Biometric devices, payment gateways, accounting tools, WhatsApp notifications, and more — all pre-integrated.' },
  { code: 'SEC', accent: '#0284c7', title: 'Enterprise-Grade Security', text: 'Role-based access control, end-to-end encryption, audit logs, and GDPR-aligned data policies for full compliance.' },
]



const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Principal, City Public School',
    text: 'KALNET transformed how we manage 1,200 students. Fee collection that used to take a full week now runs automatically.',
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Director, MedCare Clinic, Hyderabad',
    text: 'Our clinic went paperless in under two weeks. Patient records, prescriptions, billing — everything is now digital and instant.',
  },
  {
    name: 'Arjun Mehta',
    role: 'COO, Nexus Industries',
    text: 'We needed one system for HR, payroll, and procurement. KALNET delivered that and dramatically reduced weekly reporting effort.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65 },
}

function App() {
  const [navScrolled, setNavScrolled] = useState(false)
  const cursorX = useMotionValue(50)
  const cursorY = useMotionValue(40)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150])
  const backgroundY = useTransform(scrollYProgress, [0, 0.3], [0, 200])

  const smoothX = useSpring(cursorX, { stiffness: 52, damping: 30, mass: 0.9 })
  const smoothY = useSpring(cursorY, { stiffness: 52, damping: 30, mass: 0.9 })

  const spotlightLeft = useMotionTemplate`${smoothX}%`
  const spotlightTop = useMotionTemplate`${smoothY}%`
  const inverseLeft = useMotionTemplate`${useTransform(smoothX, (value) => 100 - value)}%`
  const inverseTop = useMotionTemplate`${useTransform(smoothY, (value) => 100 - value)}%`

  const gridX = useTransform(smoothX, (value) => (value - 50) * 0.9)
  const gridY = useTransform(smoothY, (value) => (value - 50) * 0.9)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    const onScroll = () => setNavScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      lenis.destroy()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <ThemeProvider theme={garvinTheme}>
      <Box sx={{ bgcolor: '#0a0a0a', color: '#ffffff' }}>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          bgcolor: navScrolled ? 'rgba(10,10,10,.88)' : 'rgba(10,10,10,.62)',
          backdropFilter: navScrolled ? 'blur(20px)' : 'blur(14px)',
          borderBottom: `1px solid ${navScrolled ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)'}`,
          transition: 'all .28s ease',
        }}
      >
        <Container maxWidth="lg" sx={{ py: navScrolled ? 0.95 : 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding .28s ease' }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, letterSpacing: '-.02em', fontSize: navScrolled ? 22 : 23, transition: 'font-size .28s ease' }}>KALNET</Typography>
          <Button
            href="https://www.kalnet.co/request-demo"
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              px: 2.4,
              fontWeight: 700,
              transition: 'all .25s ease',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 26px rgba(0,113,227,.35)' },
            }}
          >
            Book a Demo
          </Button>
        </Container>
      </Box>

      <Box
        component="section"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - rect.left) / rect.width) * 100
          const y = ((event.clientY - rect.top) / rect.height) * 100
          cursorX.set(x)
          cursorY.set(y)
        }}
        onMouseLeave={() => {
          cursorX.set(50)
          cursorY.set(40)
        }}
        sx={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 15 },
          pb: { xs: 7, md: 8 },
          overflow: 'hidden',
          position: 'relative',
          background: `
            radial-gradient(1000px 500px at 12% 8%, rgba(0,113,227,.24), transparent 60%),
            radial-gradient(900px 460px at 88% 92%, rgba(90,200,250,.16), transparent 60%),
            radial-gradient(620px 300px at 50% -14%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%)
          `,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: -40,
            x: gridX,
            y: gridY,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.5,
            background: `
              repeating-linear-gradient(90deg, rgba(255,255,255,.085) 0 1px, transparent 1px 95px),
              repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 95px)
            `,
            top: backgroundY,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            left: spotlightLeft,
            top: spotlightTop,
            width: 520,
            height: 520,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,113,227,.35) 0%, rgba(90,200,250,.2) 32%, rgba(0,0,0,0) 70%)',
            filter: 'blur(5px)',
            mixBlendMode: 'screen',
            zIndex: 0,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            left: inverseLeft,
            top: inverseTop,
            width: 300,
            height: 300,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(191,90,242,.18) 0%, rgba(0,0,0,0) 72%)',
            filter: 'blur(14px)',
            mixBlendMode: 'screen',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(500px 200px at 50% 0%, rgba(255,255,255,.07), transparent 75%)',
          }}
        />
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 860, mx: 'auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.div {...fadeUp} style={{ y: heroY, opacity: heroOpacity }}>
              <Typography sx={{ color: '#58b7ff', fontSize: 13, letterSpacing: '.16em', fontWeight: 800, mb: 2.2 }}>GEN AI-POWERED ENTERPRISE SOFTWARE</Typography>
              <Typography sx={{ color: '#fff', fontSize: { xs: 40, md: 74 }, fontWeight: 900, lineHeight: { xs: 1.05, md: 1.01 }, mb: 2.6 }}>
                The Digital <Box component="span" sx={{ background: 'linear-gradient(90deg,#0071e3,#5ac8fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Operating System</Box> for Modern Enterprises
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,.7)', fontSize: { xs: 16, md: 19 }, maxWidth: 700, mx: 'auto', lineHeight: 1.72, mb: 4.4 }}>
                Automate operations, unlock real-time insights, and scale seamlessly — one unified platform for schools, hospitals, and enterprises across India.
              </Typography>
              <Stack direction="row" gap={1.5} flexWrap="wrap" justifyContent="center">
                <Button
                  href="https://www.kalnet.co/request-demo"
                  variant="contained"
                  size="large"
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transition: 'none' },
                    '&:hover::before': { left: '100%', transition: 'all 0.6s ease' },
                    '&:hover': { transform: 'translateY(-2px) scale(1.02)' },
                  }}
                >
                  Book a Free Demo
                </Button>
                <Button
                  href="#products"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,.3)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,.8)',
                      bgcolor: 'rgba(255,255,255,.1)',
                      transform: 'translateY(-2px) scale(1.02)',
                    }
                  }}
                >
                  Explore Solutions
                </Button>
              </Stack>
              <Stack direction="row" gap={1.2} flexWrap="wrap" justifyContent="center" sx={{ mt: 3 }}>
                {['5+ Live Institutions', '30+ AI Modules', '15+ Industries'].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,.18)',
                      bgcolor: 'rgba(255,255,255,.06)',
                      color: '#f4f6fb',
                      fontSize: 13,
                      fontWeight: 600,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ bgcolor: '#fff', border: '1px solid #edf0f6', borderRadius: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' } }}>
          {[
            { value: 5, label: 'Institutions Trusted Us' },
            { value: 15, label: 'Industries Served' },
            { value: 30, label: 'AI-Powered Modules' },
          ].map((s) => (
            <Box key={s.label} sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ fontSize: { xs: 42, md: 60 }, fontWeight: 900, lineHeight: 1 }}>
                <CountUp target={s.value} suffix="+" />
              </Typography>
              <Typography sx={{ color: '#6e6e73', fontWeight: 500 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'stretch' }}>
          <motion.div {...fadeUp}>
            <Chip label="What is KALNET" sx={{ mb: 2, bgcolor: 'rgba(10,10,10,.06)' }} />
            <Typography sx={{ fontSize: { xs: 36, md: 56 }, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-.03em', mb: 2 }}>One Platform. Every Operation. Any Industry.</Typography>
            <Typography sx={{ color: '#6e6e73', fontSize: 18, lineHeight: 1.7, mb: 2 }}>KALNET is a Gen AI-powered cloud platform that replaces disconnected tools with a single intelligent operating system for your institution.</Typography>
            <Typography sx={{ color: '#6e6e73', fontSize: 18, lineHeight: 1.7, mb: 3 }}>From student fee collection and biometric attendance to patient records and payroll — every workflow, automated.</Typography>
            <Stack direction="row" gap={1.5} flexWrap="wrap">
              <Button href="https://www.kalnet.co/request-demo" variant="contained" sx={{ textTransform: 'none', borderRadius: 999, fontWeight: 700, transition: 'all .24s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 26px rgba(0,113,227,.35)' } }}>Get Started Free</Button>
              <Button href="#products" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999, fontWeight: 600, transition: 'all .24s ease', '&:hover': { transform: 'translateY(-2px)' } }}>See All Solutions</Button>
            </Stack>
          </motion.div>
          <motion.div {...fadeUp}>
            <CardBlock>
              <Typography sx={{ fontSize: 13, letterSpacing: '.12em', color: '#5f6f8e', fontWeight: 700, mb: 2 }}>UNIFIED CONTROL LAYER</Typography>
              <Stack gap={1.4}>
                {[
                  ['Admissions to Alumni', 'Single pipeline across the full lifecycle.'],
                  ['Finance to Compliance', 'Automated collections, approvals, and reporting.'],
                  ['Operations to Insights', 'Real-time visibility with AI-led recommendations.'],
                ].map((item) => (
                  <Box key={item[0]} sx={{ p: 1.7, borderRadius: 2, bgcolor: '#f8faff', border: '1px solid #e3e9f8' }}>
                    <Typography sx={{ fontWeight: 700, mb: 0.4 }}>{item[0]}</Typography>
                    <Typography sx={{ color: '#6e6e73', fontSize: 14 }}>{item[1]}</Typography>
                  </Box>
                ))}
              </Stack>
              <Box sx={{ mt: 2.2, p: 2, borderRadius: 2, bgcolor: '#0e1525', border: '1px solid #26344f' }}>
                <Typography sx={{ color: '#89c1ff', fontSize: 12, letterSpacing: '.08em', mb: 1 }}>SYSTEM HEALTH</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1 }}>
                  {[
                    ['99.9%', 'Uptime'],
                    ['< 2s', 'Response'],
                    ['24/7', 'Monitoring'],
                  ].map((metric) => (
                    <Box key={metric[1]} sx={{ p: 1.2, borderRadius: 1.6, bgcolor: 'rgba(255,255,255,.04)' }}>
                      <Typography sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.1 }}>{metric[0]}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,.64)', fontSize: 12 }}>{metric[1]}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardBlock>
          </motion.div>
        </Box>
      </Container>

      <InfiniteMarquee text="Unified Operating System" />

      <Section title="Software Built for Your Industry" subtitle="Every solution is purpose-built with the workflows, modules, and automations specific to your sector — not a one-size-fits-all tool." id="products" surface>
        <GridWrap>
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  border: '1.5px solid #e4e7f0',
                  borderRadius: 2.8,
                  p: 3.1,
                  boxShadow: '0 18px 38px rgba(17,24,39,.05)',
                  transition: 'all .28s ease',
                  '&:hover': { borderColor: '#c8d4ee', transform: 'translateY(-5px)', boxShadow: '0 22px 46px rgba(15,23,42,.11)' },
                }}
              >
                <motion.div
                  initial={{ scaleX: 0, opacity: 0.55 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: 0.15 + index * 0.08 }}
                  style={{ transformOrigin: 'left center', position: 'absolute', left: 0, top: 0, width: '100%', height: 3, background: `linear-gradient(90deg, ${item.accent}, #93c5fd)` }}
                />
                <Box sx={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(circle, ${item.accent}33 0%, transparent 72%)` }} />
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.8,
                    mb: 1.6,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '.08em',
                    color: '#fff',
                    background: `linear-gradient(135deg, ${item.accent}, #1d4ed8)`,
                    boxShadow: `0 10px 24px ${item.accent}55`,
                  }}
                >
                  {item.code}
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 22, mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: '#6e6e73', mb: 2 }}>{item.text}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {item.tags.map((tag) => (
                    <Chip key={tag} size="small" label={tag} sx={{ bgcolor: '#eef3ff', color: '#2a3e67', fontWeight: 600 }} />
                  ))}
                </Stack>
              </Box>
            </motion.div>
          ))}
        </GridWrap>
      </Section>

      <FlagshipStorySection />

      <Section title="Everything You Need. Nothing You Don't." subtitle="Every KALNET deployment ships with these powerful capabilities out of the box." surface>
        <GridWrap>
          {features.map((f, index) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.06 }}>
              <Box sx={{ 
                position: 'relative', 
                p: 3.6, 
                borderRadius: 3.2, 
                bgcolor: '#fff', 
                border: '1.5px solid #e4e7f0', 
                background: `linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%)`,
                boxShadow: '0 10px 30px rgba(0,0,0,.06), 0 0 1px rgba(0,113,227,.1)',
                height: '100%', 
                transition: 'all .35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                overflow: 'hidden',
                '&:hover': { 
                  borderColor: f.accent,
                  transform: 'translateY(-8px)', 
                  boxShadow: `0 24px 48px rgba(0,113,227,.18), 0 0 1px ${f.accent}40`,
                  background: `linear-gradient(135deg, #ffffff 0%, ${f.accent}08 100%)`,
                } 
              }}>
                {/* Accent top border */}
                <Box sx={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 3, background: `linear-gradient(90deg, ${f.accent}, #93c5fd)`, opacity: 0.8 }} />
                
                {/* Decorative corner gradient */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle, ${f.accent}12, transparent 70%)`, pointerEvents: 'none' }} />
                
                {/* Badge */}
                <motion.div whileHover={{ scale: 1.12, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                  <Box sx={{ 
                    width: 54, 
                    height: 54, 
                    borderRadius: 2.2, 
                    mb: 2.2, 
                    display: 'grid', 
                    placeItems: 'center', 
                    fontSize: 13, 
                    fontWeight: 900, 
                    letterSpacing: '.06em', 
                    color: '#fff', 
                    background: `linear-gradient(135deg, ${f.accent}, #1d4ed8)`, 
                    boxShadow: `0 16px 32px ${f.accent}32`,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 2.2,
                      background: `linear-gradient(45deg, rgba(255,255,255,.2), transparent)`,
                      pointerEvents: 'none'
                    }
                  }}>
                    {f.code}
                  </Box>
                </motion.div>
                
                <Typography sx={{ fontWeight: 900, fontSize: 20, mb: 1.2, color: '#0a0a0a', letterSpacing: '-.01em' }}>{f.title}</Typography>
                <Typography sx={{ color: '#505050', fontSize: 15.5, lineHeight: 1.6, fontWeight: 500 }}>{f.text}</Typography>
                
                {/* Hidden accent line on hover */}
                <Box sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)`,
                  opacity: 0,
                  transition: 'opacity .35s ease',
                  '.&:hover &': { opacity: 1 }
                }} />
              </Box>
            </motion.div>
          ))}
        </GridWrap>
      </Section>

      <ServicesShowcase />

      <IndustriesShowcase />

      <InfiniteMarquee text="Trusted by Institutions Nationwide" />

      <Section title="Trusted by Leaders Across India" subtitle="See what our clients say about running their institution on KALNET." surface>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2} sx={{ mb: 5 }}>
          <Chip label="VERIFIED CLIENT RATING" sx={{ bgcolor: '#eaf2ff', color: '#24467f', fontWeight: 700, letterSpacing: '.03em' }} />
          <Typography sx={{ fontWeight: 800, color: '#1d1d1f' }}>4.8 / 5</Typography>
          <Typography sx={{ color: '#6e6e73' }}>across institutions</Typography>
        </Stack>
        <GridWrap cols={{ xs: 1, md: 3 }}>
          {testimonials.map((t) => (
            <motion.div key={t.name} {...fadeUp}>
              <CardBlock>
                <Typography sx={{ color: '#0071e3', fontSize: 40, lineHeight: 1, mb: 1 }}>"</Typography>
                <Typography sx={{ mb: 2, color: '#1d1d1f' }}>{t.text}</Typography>
                <Typography sx={{ fontWeight: 800, color: '#0a0a0a' }}>{t.name}</Typography>
                <Typography sx={{ color: '#6e6e73', fontSize: 14 }}>{t.role}</Typography>
              </CardBlock>
            </motion.div>
          ))}
        </GridWrap>
      </Section>

      <Box component="section" sx={{ py: 14, textAlign: 'center', background: '#0a0a0a' }}>
        <Container maxWidth="md">
          <Typography sx={{ color: '#fff', fontSize: { xs: 40, md: 64 }, fontWeight: 900, lineHeight: 1.05, mb: 2 }}>
            Ready to Digitise Your <Box component="span" sx={{ background: 'linear-gradient(90deg,#0071e3,#5ac8fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Institution?</Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.6)', fontSize: 19, mb: 4 }}>
            Join 5+ institutions already running smarter on KALNET.
          </Typography>
          <Stack direction="row" justifyContent="center" gap={1.5} flexWrap="wrap">
            <Button href="https://www.kalnet.co/request-demo" variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 999, px: 3.2, fontWeight: 700, transition: 'all .24s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 34px rgba(0,113,227,.38)' } }}>Book a Free Demo</Button>
            <Button href="mailto:hello@kalnet.co" variant="outlined" size="large" sx={{ textTransform: 'none', borderRadius: 999, px: 3.2, color: '#fff', borderColor: 'rgba(255,255,255,.35)', fontWeight: 650, transition: 'all .24s ease', '&:hover': { borderColor: 'rgba(255,255,255,.62)', bgcolor: 'rgba(255,255,255,.05)', transform: 'translateY(-2px)' } }}>Talk to Sales</Button>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.65)' }}>
        <Typography sx={{ fontSize: 13 }}>© 2026 KALNET Solutions Pvt Ltd. All rights reserved.</Typography>
      </Box>
    </Box>
    </ThemeProvider>
  )
}

type SectionProps = {
  title: string
  subtitle: string
  id?: string
  surface?: boolean
  children: ReactNode
}

function Section({ title, subtitle, children, id, surface = false }: SectionProps) {
  return (
    <Box component="section" id={id} sx={{ py: 10, bgcolor: surface ? '#f6f7fb' : '#fff' }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: { xs: 36, md: 56 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', mb: 1, color: surface ? '#0a0a0a' : '#1d1d1f' }}>{title}</Typography>
        <Typography sx={{ textAlign: 'center', color: surface ? '#404040' : '#6e6e73', maxWidth: 620, mx: 'auto', mb: 6 }}>{subtitle}</Typography>
        {children}
      </Container>
    </Box>
  )
}

function GridWrap({
  children,
  cols = { xs: 1, md: 2 },
}: {
  children: ReactNode
  cols?: { xs: number; md: number }
}) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: `repeat(${cols.xs}, minmax(0,1fr))`, md: `repeat(${cols.md}, minmax(0,1fr))` }, gap: 3 }}>
      {children}
    </Box>
  )
}

function ServicesShowcase() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * 0.99 * features.length)
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  })

  const variants = {
    enter: { opacity: 0, y: 40 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -40, transition: { duration: 0.4 } }
  }

  return (
    <Box component="section" ref={containerRef} sx={{ height: `${features.length * 100}vh`, position: 'relative', bgcolor: '#0a0a0a', color: '#fff' }}>
      <Box sx={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 8, alignItems: 'center', height: '100%' }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography sx={{ color: '#58b7ff', fontSize: 13, letterSpacing: '.16em', fontWeight: 800, mb: 2 }}>CORE CAPABILITIES</Typography>
            {features.map((f, i) => {
              const isActive = i === activeIndex
              return (
                <Stack key={f.code} direction="row" alignItems="center" spacing={2.5} sx={{ cursor: 'pointer', transition: 'all 0.3s ease', opacity: isActive ? 1 : 0.4, '&:hover': { opacity: isActive ? 1 : 0.8 } }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${isActive ? f.accent : '#555'}`, bgcolor: isActive ? f.accent : 'transparent', transition: 'all 0.3s ease', transform: isActive ? 'scale(1.2)' : 'scale(1)' }} />
                  <Typography sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800, letterSpacing: '-0.02em', transition: 'all 0.3s ease' }}>{f.title}</Typography>
                </Stack>
              )
            })}
          </Box>

          <Box sx={{ position: 'relative', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              style={{ position: 'absolute', right: -60, top: '50%', marginTop: -200, width: 400, height: 400, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <Box sx={{ width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'radial-gradient(circle, rgba(90,200,250,0.1) 0%, transparent 70%)' }} />
              <Box sx={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${features[activeIndex].accent}40 0%, transparent 60%)`, filter: 'blur(20px)', transition: 'background 0.6s ease' }} />
              <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${features[activeIndex].accent}40 100%)`, filter: 'blur(8px)', mixBlendMode: 'screen', transition: 'all 0.6s ease' }} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: 2, mb: 3, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.08em', color: '#fff', background: `linear-gradient(135deg, ${features[activeIndex].accent}, #1d4ed8)`, boxShadow: `0 12px 28px ${features[activeIndex].accent}55` }}>
                  {features[activeIndex].code}
                </Box>
                <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, lineHeight: 1.1, mb: 2 }}>{features[activeIndex].title}</Typography>
                <Typography sx={{ fontSize: { xs: 16, md: 20 }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 440 }}>{features[activeIndex].text}</Typography>
              </motion.div>
            </AnimatePresence>
          </Box>

        </Container>
      </Box>
    </Box>
  )
}

function IndustriesShowcase() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [-200, 400])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180])
  const y2 = useTransform(scrollYProgress, [0, 1], [300, -300])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [180, 0])

  return (
    <Box component="section" ref={containerRef} sx={{ position: 'relative', overflow: 'hidden', py: { xs: 8, md: 14 } }}>
      <motion.div style={{ y: y1, rotate: rotate1, position: 'absolute', left: '-5%', top: '10%', pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ width: 600, height: 600, borderRadius: '50%', border: '2px dashed rgba(0, 51, 160, 0.15)', opacity: 0.6 }} />
      </motion.div>
      <motion.div style={{ y: y2, rotate: rotate2, position: 'absolute', right: '-10%', bottom: '20%', pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{ width: 800, height: 800, borderRadius: '20%', border: '4px solid rgba(94, 183, 255, 0.1)', opacity: 0.5 }} />
      </motion.div>
      <motion.div style={{ y: y1, position: 'absolute', left: '40%', top: '50%', pointerEvents: 'none', filter: 'blur(100px)', zIndex: 0 }}>
        <Box sx={{ width: 400, height: 400, borderRadius: '50%', background: 'rgba(0, 113, 227, 0.08)' }} />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography sx={{ fontSize: { xs: 36, md: 56 }, fontWeight: 900, mb: 2, letterSpacing: '-.03em', color: '#1d1d1f' }}>Software Built for Your Industry</Typography>
          <Typography sx={{ color: '#6e6e73', fontSize: { xs: 16, md: 19 }, maxWidth: 660, mx: 'auto', lineHeight: 1.6 }}>
            Every solution is purpose-built with the workflows, modules, and automations specific to your sector — not a one-size-fits-all tool.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {products.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Box sx={{ 
                position: 'relative', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
                borderRadius: 3, p: 4, pt: 5, overflow: 'hidden', border: '1px solid #e3e9f8', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.04)', transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 30px 60px rgba(0,51,160,0.08)' }
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${item.accent}33 0%, transparent 70%)`, filter: 'blur(20px)' }} />
                
                <Box sx={{ width: 46, height: 46, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: item.accent, color: '#fff', fontWeight: 800, fontSize: 13, mb: 2.5, boxShadow: `0 8px 16px ${item.accent}4d` }}>
                  {item.code}
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em', color: '#1d1d1f' }}>{item.title}</Typography>
                <Typography sx={{ color: '#6e6e73', mb: 3, lineHeight: 1.6, fontSize: 15 }}>{item.text}</Typography>
                
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#f1f5fa', color: '#334155', fontWeight: 600, fontSize: 12, border: 'none' }} />
                  ))}
                </Stack>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

function CardBlock({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1.5px solid #e4e7f0',
        borderRadius: 2.5,
        p: compact ? 2.2 : 3.2,
        boxShadow: '0 18px 38px rgba(17,24,39,.05)',
        height: '100%',
        '&:hover': { borderColor: '#c8d4ee', transform: 'translateY(-4px)' },
        transition: 'all .25s ease',
      }}
    >
      {children}
    </Box>
  )
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return

    const durationMs = 1400
    const start = performance.now()

    let raf = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target])

  return (
    <motion.span
      initial={{ opacity: 0.7, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.35 }}
      onViewportEnter={() => setStarted(true)}
      style={{ display: 'inline-block' }}
    >
      {value}
      {suffix}
    </motion.span>
  )
}

function InfiniteMarquee({ text }: { text: string }) {
  const words = new Array(6).fill(text)
  
  return (
    <Box sx={{ py: 3.5, background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.04)', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 15 }}
        style={{ display: 'flex', whiteSpace: 'nowrap' }}
      >
        <Stack direction="row" spacing={8} sx={{ pr: 8 }}>
          {words.map((w, i) => (
            <Stack direction="row" alignItems="center" spacing={4} key={i}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg, #0071e3, #5ac8fa)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,.9)', fontSize: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', WebkitTextStroke: '1px rgba(255,255,255,0.2)', WebkitTextFillColor: 'transparent' }}>
                {w}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={8} sx={{ pr: 8 }}>
          {words.map((w, i) => (
            <Stack direction="row" alignItems="center" spacing={4} key={`dup-${i}`}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg, #0071e3, #5ac8fa)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,.9)', fontSize: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', WebkitTextStroke: '1px rgba(255,255,255,0.2)', WebkitTextFillColor: 'transparent' }}>
                {w}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </motion.div>
    </Box>
  )
}

function FlagshipStorySection() {
  const steps = [
    ['01', 'Connect Your Existing Stack', 'Map workflows, import legacy data, and establish role-level access controls.'],
    ['02', 'Automate Critical Workflows', "Enable KALNET's AI routing for billing, attendance, approvals, and reporting."],
    ['03', 'Scale with Operational Insight', 'Track KPIs in real time and roll out additional modules without disruption.'],
  ]

  return (
    <Box component="section" sx={{ py: 10, background: '#fff' }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: { xs: 36, md: 56 }, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-.03em', mb: 1 }}>
          Up and Running in Days, Not Months
        </Typography>
        <Typography sx={{ textAlign: 'center', color: '#6e6e73', maxWidth: 620, mx: 'auto', mb: 6 }}>
          A sticky, guided rollout model designed for zero-disruption adoption across departments.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr .85fr' }, gap: 3.2, alignItems: 'start' }}>
          <Box>
            {steps.map((step, index) => (
              <motion.div key={step[0]} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, delay: index * 0.08 }}>
                <Box sx={{ p: 2.4, borderRadius: 2.5, border: '1.5px solid #e4e7f0', mb: 2, background: '#fff', boxShadow: '0 16px 36px rgba(16,24,40,.06)' }}>
                  <Typography sx={{ color: '#3f6cbc', fontSize: 12, fontWeight: 800, letterSpacing: '.12em', mb: 0.7 }}>STEP {step[0]}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 24, mb: 0.8 }}>{step[1]}</Typography>
                  <Typography sx={{ color: '#6e6e73' }}>{step[2]}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ position: { xs: 'relative', md: 'sticky' }, top: { md: 110 }, borderRadius: 2.7, border: '1.5px solid #dfe5f3', overflow: 'hidden', background: '#0f172a', boxShadow: '0 26px 56px rgba(15,23,42,.22)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,.12)', display: 'flex', gap: 1 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#f87171' }} />
              <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#fbbf24' }} />
              <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#4ade80' }} />
            </Box>
            <Box sx={{ p: 2.2 }}>
              <Typography sx={{ color: '#9cc8ff', fontSize: 12, letterSpacing: '.08em', fontWeight: 700, mb: 1 }}>ROLL OUT CONTROL ROOM</Typography>
              <Stack spacing={1.2}>
                {[
                  ['Data Migration', 'Completed'],
                  ['Workflow Automation', 'In Progress'],
                  ['Multi-site Expansion', 'Queued'],
                ].map((item) => (
                  <Box key={item[0]} sx={{ p: 1.4, borderRadius: 1.7, bgcolor: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{item[0]}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>{item[1]}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App
