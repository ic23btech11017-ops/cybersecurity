import { useState } from 'react'
import {
  Dashboard,
  GppGood,
  Logout,
  Menu as MenuIcon,
  ReceiptLong,
  Security,
  Settings,
  Shield,
  Description,
  DarkMode,
  LightMode,
  Notifications,
  Search as SearchIcon,
  ExpandMore,
  ExpandLess,
  Person,
} from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
const drawerWidth = 260
const collapsedDrawerWidth = 0

interface NavGroup {
  label: string
  icon: React.ReactElement
  children: { label: string; path: string }[]
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactElement
}

type NavEntry = NavItem | NavGroup

const isGroup = (entry: NavEntry): entry is NavGroup => 'children' in entry

const navEntries: NavEntry[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  {
    label: 'Operations',
    icon: <Security />,
    children: [
      { label: 'Clients', path: '/clients' },
      { label: 'Assets', path: '/assets' },
      { label: 'Incidents', path: '/incidents' },
      { label: 'SOC Queue', path: '/soc-queue' },
    ],
  },
  {
    label: 'Risk & Compliance',
    icon: <GppGood />,
    children: [
      { label: 'Risks', path: '/risks' },
      { label: 'Compliance', path: '/compliance' },
      { label: 'Evidence', path: '/evidence' },
    ],
  },
  {
    label: 'Reports & SLA',
    icon: <Description />,
    children: [
      { label: 'Reports', path: '/reports' },
      { label: 'SLA Tracking', path: '/sla' },
    ],
  },
  { label: 'Billing', path: '/billing', icon: <ReceiptLong /> },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
]

const notifications = [
  { id: 1, text: 'Critical: DNS exfiltration detected on TerraCloud', time: '8 min ago', read: false },
  { id: 2, text: 'SLA breach warning for Portline Energy', time: '22 min ago', read: false },
  { id: 3, text: 'Incident INC-1052 escalated to L3', time: '1 hour ago', read: false },
  { id: 4, text: 'Risk RSK-415 requires immediate attention', time: '2 hours ago', read: true },
  { id: 5, text: 'Compliance audit bundle exported', time: '3 hours ago', read: true },
]

export const AppShell = ({
  mode,
  onToggleMode,
}: {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)
  const location = useLocation()
  const { logout, role } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()

  // const allItems = useMemo(() => {
  //   const items: { label: string; path: string }[] = []
  //   navEntries.forEach((entry) => {
  //     if (isGroup(entry)) {
  //       entry.children.forEach((child) => items.push(child))
  //     } else {
  //       items.push(entry)
  //     }
  //   })
  //   return items
  // }, [])

  const initials = role
    .split('_')
    .map((w) => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  const roleName = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const unreadCount = notifications.filter((n) => !n.read).length

  const currentDrawerWidth = desktopOpen ? drawerWidth : collapsedDrawerWidth

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ 
          ml: { md: `${currentDrawerWidth}px` }, 
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton 
            onClick={() => {
              setMobileOpen(!mobileOpen)
              setDesktopOpen(!desktopOpen)
            }} 
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Global Search */}
          <TextField
            size="small"
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: 140, sm: 240 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.85rem',
                bgcolor: alpha(theme.palette.text.primary, 0.04),
              },
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton onClick={onToggleMode} size="small">
                {mode === 'dark' ? <LightMode sx={{ fontSize: 20 }} /> : <DarkMode sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            {/* Notifications — clickable dropdown */}
            <Tooltip title="Notifications">
              <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                  <Notifications sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={() => setNotifAnchor(null)}
              slotProps={{
                paper: {
                  sx: {
                    width: 360,
                    maxHeight: 400,
                    mt: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Notifications ({unreadCount} new)
                </Typography>
              </Box>
              <Divider />
              {notifications.map((n) => (
                <MenuItem
                  key={n.id}
                  onClick={() => {
                    setNotifAnchor(null)
                    navigate('/incidents')
                  }}
                  sx={{
                    whiteSpace: 'normal',
                    py: 1.5,
                    px: 2,
                    bgcolor: n.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 600, fontSize: '0.84rem' }}>
                      {n.text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {n.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={() => { setNotifAnchor(null); navigate('/incidents') }} sx={{ justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  View all notifications
                </Typography>
              </MenuItem>
            </Menu>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

            {/* Profile — navigates to /profile */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: 'pointer', pl: 0.5, '&:hover': { opacity: 0.8 } }}
              onClick={() => navigate('/profile')}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.2 }}>
                  {roleName}
                </Typography>
              </Box>
            </Stack>
            <Tooltip title="Sign out">
              <IconButton onClick={logout} size="small" sx={{ ml: 0.5 }}>
                <Logout sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 }, transition: theme.transitions.create('width') }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          <SidebarContent role={role} currentPath={location.pathname} />
        </Drawer>
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <SidebarContent role={role} currentPath={location.pathname} />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        <Outlet />
      </Box>
    </Box>
  )
}

/* ──────────────── Sidebar ──────────────── */
const SidebarContent = ({ role, currentPath }: { role: string; currentPath: string }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Operations: true,
    'Risk & Compliance': true,
    'Reports & SLA': false,
  })

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const initials = role
    .split('_')
    .map((w) => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  const roleName = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Shield sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '0.95rem' }}>
              CyberOps360
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
              CFMS Console
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <Divider />

      <List sx={{ flex: 1, py: 1, overflowY: 'auto' }}>
        {navEntries.map((entry) => {
          if (isGroup(entry)) {
            const isOpen = openGroups[entry.label] ?? false
            const isActive = entry.children.some((child) => currentPath.startsWith(child.path))

            return (
              <Box key={entry.label}>
                <ListItemButton onClick={() => toggleGroup(entry.label)}>
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : undefined }}>
                    {entry.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={entry.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: '0.88rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? theme.palette.primary.main : undefined,
                        },
                      },
                    }}
                  />
                  {isOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {entry.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={NavLink}
                        to={child.path}
                        sx={{ pl: 7, py: 0.5 }}
                      >
                        <ListItemText
                          primary={child.label}
                          slotProps={{
                            primary: { sx: { fontSize: '0.84rem' } },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
          }

          return (
            <ListItemButton key={entry.path} component={NavLink} to={entry.path}>
              <ListItemIcon sx={{ minWidth: 40 }}>{entry.icon}</ListItemIcon>
              <ListItemText
                primary={entry.label}
                slotProps={{
                  primary: { sx: { fontSize: '0.88rem', fontWeight: 500 } },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      <Divider />

      {/* Sidebar profile — clickable */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }, borderRadius: 1 }}
        onClick={() => navigate('/profile')}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            fontSize: '0.75rem',
            fontWeight: 700,
            bgcolor: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }} noWrap>
            {roleName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
            Active session
          </Typography>
        </Box>
        <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Stack>
    </Box>
  )
}
