// DrumLatch — Sample Data

export type MachineStatus = 'available' | 'in-use' | 'locked' | 'overdue' | 'offline' | 'alert' | 'reserved'
export type MachineType = 'washer' | 'dryer'

export interface Machine {
  id: string
  number: string
  type: MachineType
  status: MachineStatus
  lockStatus: 'locked' | 'unlocked' | 'error'
  cycleStarted?: string
  cycleEnd?: string
  cycleDuration?: number // minutes
  graceEnd?: string
  customer?: string
  customerId?: string
  revenue: number
  lastMaintenance: string
  firmware: string
  battery: number
  connectivity: 'online' | 'offline' | 'degraded'
  location: { x: number; y: number }
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  joined: string
  visits: number
  drumTokens: number
  pickupStreak: number
  onTimeRate: number
  totalSpent: number
  status: 'active' | 'suspended' | 'blacklisted'
  lastVisit: string
  achievements: string[]
}

export interface SecurityEvent {
  id: string
  type: 'forced-entry' | 'tamper' | 'failed-unlock' | 'emergency' | 'override' | 'theft-alert' | 'offline' | 'movement'
  machineId: string
  machineNumber: string
  timestamp: string
  customerId?: string
  customerName?: string
  staffId?: string
  staffName?: string
  resolved: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  role: 'manager' | 'attendant' | 'supervisor'
  shift: string
  overrides: number
  status: 'active' | 'inactive'
  lastLogin: string
}

export interface Organization {
  id: string
  name: string
  location: string
  owner: string
  machines: number
  activeMachines: number
  mrr: number
  status: 'active' | 'trial' | 'churned' | 'onboarding'
  healthScore: number
  tier: 'starter' | 'professional' | 'enterprise'
  joined: string
  lastActive: string
}

export const MACHINES: Machine[] = [
  { id: 'm1', number: 'W-01', type: 'washer', status: 'in-use', lockStatus: 'locked', cycleStarted: '2:14 PM', cycleEnd: '2:54 PM', cycleDuration: 40, graceEnd: '3:04 PM', customer: 'Maria Santos', customerId: 'c1', revenue: 4.50, lastMaintenance: '2025-07-01', firmware: '2.4.1', battery: 92, connectivity: 'online', location: { x: 1, y: 1 } },
  { id: 'm2', number: 'W-02', type: 'washer', status: 'overdue', lockStatus: 'locked', cycleStarted: '1:30 PM', cycleEnd: '2:10 PM', cycleDuration: 40, graceEnd: '2:20 PM', customer: 'James Kim', customerId: 'c2', revenue: 4.50, lastMaintenance: '2025-06-28', firmware: '2.4.1', battery: 87, connectivity: 'online', location: { x: 2, y: 1 } },
  { id: 'm3', number: 'W-03', type: 'washer', status: 'available', lockStatus: 'unlocked', revenue: 0, lastMaintenance: '2025-07-05', firmware: '2.4.1', battery: 100, connectivity: 'online', location: { x: 3, y: 1 } },
  { id: 'm4', number: 'W-04', type: 'washer', status: 'in-use', lockStatus: 'locked', cycleStarted: '2:30 PM', cycleEnd: '3:10 PM', cycleDuration: 40, customer: 'Priya Patel', customerId: 'c3', revenue: 5.25, lastMaintenance: '2025-07-03', firmware: '2.4.0', battery: 78, connectivity: 'online', location: { x: 4, y: 1 } },
  { id: 'm5', number: 'W-05', type: 'washer', status: 'available', lockStatus: 'unlocked', revenue: 0, lastMaintenance: '2025-07-06', firmware: '2.4.1', battery: 95, connectivity: 'online', location: { x: 5, y: 1 } },
  { id: 'm6', number: 'W-06', type: 'washer', status: 'offline', lockStatus: 'error', revenue: 0, lastMaintenance: '2025-06-20', firmware: '2.3.9', battery: 12, connectivity: 'offline', location: { x: 6, y: 1 } },
  { id: 'm7', number: 'D-01', type: 'dryer', status: 'in-use', lockStatus: 'locked', cycleStarted: '2:00 PM', cycleEnd: '2:45 PM', cycleDuration: 45, customer: 'Maria Santos', customerId: 'c1', revenue: 3.75, lastMaintenance: '2025-07-02', firmware: '2.4.1', battery: 90, connectivity: 'online', location: { x: 1, y: 2 } },
  { id: 'm8', number: 'D-02', type: 'dryer', status: 'available', lockStatus: 'unlocked', revenue: 0, lastMaintenance: '2025-07-04', firmware: '2.4.1', battery: 88, connectivity: 'online', location: { x: 2, y: 2 } },
  { id: 'm9', number: 'D-03', type: 'dryer', status: 'alert', lockStatus: 'error', cycleStarted: '1:45 PM', revenue: 3.75, lastMaintenance: '2025-06-15', firmware: '2.3.8', battery: 45, connectivity: 'degraded', location: { x: 3, y: 2 } },
  { id: 'm10', number: 'D-04', type: 'dryer', status: 'in-use', lockStatus: 'locked', cycleStarted: '2:20 PM', cycleEnd: '3:05 PM', cycleDuration: 45, customer: 'Devon Clarke', customerId: 'c4', revenue: 4.25, lastMaintenance: '2025-07-01', firmware: '2.4.1', battery: 94, connectivity: 'online', location: { x: 4, y: 2 } },
  { id: 'm11', number: 'D-05', type: 'dryer', status: 'available', lockStatus: 'unlocked', revenue: 0, lastMaintenance: '2025-07-06', firmware: '2.4.1', battery: 99, connectivity: 'online', location: { x: 5, y: 2 } },
  { id: 'm12', number: 'D-06', type: 'dryer', status: 'available', lockStatus: 'unlocked', revenue: 0, lastMaintenance: '2025-07-05', firmware: '2.4.1', battery: 97, connectivity: 'online', location: { x: 6, y: 2 } },
]

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Maria Santos', email: 'maria@email.com', phone: '(555) 201-4488', joined: '2024-03-12', visits: 47, drumTokens: 2340, pickupStreak: 12, onTimeRate: 97, totalSpent: 284.50, status: 'active', lastVisit: '2025-07-14', achievements: ['First Secure Pickup', '10 On-Time Pickups', '30-Day Streak', 'Security Champion'] },
  { id: 'c2', name: 'James Kim', email: 'jkim@email.com', phone: '(555) 307-9912', joined: '2024-05-08', visits: 31, drumTokens: 850, pickupStreak: 0, onTimeRate: 71, totalSpent: 186.75, status: 'active', lastVisit: '2025-07-14', achievements: ['First Secure Pickup'] },
  { id: 'c3', name: 'Priya Patel', email: 'priya.p@email.com', phone: '(555) 443-7821', joined: '2024-08-20', visits: 22, drumTokens: 1120, pickupStreak: 5, onTimeRate: 91, totalSpent: 132.00, status: 'active', lastVisit: '2025-07-14', achievements: ['First Secure Pickup', '10 On-Time Pickups'] },
  { id: 'c4', name: 'Devon Clarke', email: 'dclarke@email.com', phone: '(555) 892-3345', joined: '2024-01-15', visits: 89, drumTokens: 4750, pickupStreak: 22, onTimeRate: 99, totalSpent: 534.25, status: 'active', lastVisit: '2025-07-14', achievements: ['First Secure Pickup', '10 On-Time Pickups', '30-Day Streak', 'Security Champion', 'Community Hero'] },
  { id: 'c5', name: 'Aisha Johnson', email: 'aisha.j@email.com', phone: '(555) 112-6634', joined: '2024-11-02', visits: 14, drumTokens: 420, pickupStreak: 3, onTimeRate: 85, totalSpent: 78.50, status: 'active', lastVisit: '2025-07-10', achievements: ['First Secure Pickup'] },
  { id: 'c6', name: 'Carlos Rivera', email: 'carlos.r@email.com', phone: '(555) 778-2290', joined: '2024-02-28', visits: 55, drumTokens: 0, pickupStreak: 0, onTimeRate: 52, totalSpent: 312.00, status: 'suspended', lastVisit: '2025-06-30', achievements: ['First Secure Pickup'] },
]

export const SECURITY_EVENTS: SecurityEvent[] = [
  { id: 'se1', type: 'forced-entry', machineId: 'm9', machineNumber: 'D-03', timestamp: '2:41 PM', customerId: undefined, resolved: false, severity: 'critical', description: 'Door forced open — latch resistance exceeded threshold. Tamper flag set.' },
  { id: 'se2', type: 'failed-unlock', machineId: 'm2', machineNumber: 'W-02', timestamp: '2:28 PM', customerId: 'c2', customerName: 'James Kim', resolved: false, severity: 'medium', description: '3 failed unlock attempts — biometric mismatch. Customer notified.' },
  { id: 'se3', type: 'offline', machineId: 'm6', machineNumber: 'W-06', timestamp: '1:55 PM', resolved: false, severity: 'high', description: 'Device went offline — low battery (12%). Last seen 48 mins ago.' },
  { id: 'se4', type: 'override', machineId: 'm3', machineNumber: 'W-03', timestamp: '1:30 PM', staffId: 's1', staffName: 'Alex Torres', resolved: true, severity: 'low', description: 'Manager override performed. Customer confirmed laundry removal.' },
  { id: 'se5', type: 'tamper', machineId: 'm9', machineNumber: 'D-03', timestamp: '2:38 PM', resolved: false, severity: 'high', description: 'Unexpected device movement detected on accelerometer.' },
  { id: 'se6', type: 'emergency', machineId: 'm5', machineNumber: 'W-05', timestamp: '12:15 PM', staffId: 's2', staffName: 'Jamie Lee', resolved: true, severity: 'medium', description: 'Emergency unlock requested by customer — machine malfunction. Staff verified.' },
]

export const STAFF: StaffMember[] = [
  { id: 's1', name: 'Alex Torres', email: 'alex@spinspot.com', role: 'manager', shift: '8 AM – 4 PM', overrides: 12, status: 'active', lastLogin: '9:02 AM today' },
  { id: 's2', name: 'Jamie Lee', email: 'jamie@spinspot.com', role: 'attendant', shift: '12 PM – 8 PM', overrides: 4, status: 'active', lastLogin: '12:05 PM today' },
  { id: 's3', name: 'Sam Nguyen', email: 'sam@spinspot.com', role: 'supervisor', shift: '4 PM – 12 AM', overrides: 8, status: 'active', lastLogin: 'Yesterday 4:01 PM' },
]

export const ORGANIZATIONS: Organization[] = [
  { id: 'org1', name: 'SpinSpot Laundry', location: 'Austin, TX', owner: 'Linda Park', machines: 12, activeMachines: 10, mrr: 1240, status: 'active', healthScore: 94, tier: 'professional', joined: '2024-03-01', lastActive: 'Today' },
  { id: 'org2', name: 'CleanWave', location: 'Denver, CO', owner: 'Marcus Reed', machines: 8, activeMachines: 7, mrr: 820, status: 'active', healthScore: 88, tier: 'starter', joined: '2024-05-15', lastActive: 'Today' },
  { id: 'org3', name: 'Laundry Loop', location: 'Portland, OR', owner: 'Sofia Chen', machines: 20, activeMachines: 18, mrr: 2150, status: 'active', healthScore: 97, tier: 'enterprise', joined: '2023-11-20', lastActive: 'Today' },
  { id: 'org4', name: 'FreshSpin', location: 'Nashville, TN', owner: 'Tyler Brooks', machines: 6, activeMachines: 0, mrr: 0, status: 'trial', healthScore: 62, tier: 'starter', joined: '2025-06-28', lastActive: '3 days ago' },
  { id: 'org5', name: 'QuickWash Pro', location: 'Phoenix, AZ', owner: 'Naomi White', machines: 15, activeMachines: 14, mrr: 1680, status: 'active', healthScore: 91, tier: 'professional', joined: '2024-01-10', lastActive: 'Today' },
  { id: 'org6', name: 'Suds & Go', location: 'Tampa, FL', owner: 'Chris Vega', machines: 10, activeMachines: 0, mrr: 0, status: 'churned', healthScore: 20, tier: 'starter', joined: '2023-09-01', lastActive: '45 days ago' },
]

export const REVENUE_DATA = [
  { month: 'Jan', cycle: 3200, fees: 180, rewards: 420 },
  { month: 'Feb', cycle: 3480, fees: 210, rewards: 390 },
  { month: 'Mar', cycle: 3750, fees: 195, rewards: 450 },
  { month: 'Apr', cycle: 4100, fees: 240, rewards: 510 },
  { month: 'May', cycle: 4380, fees: 205, rewards: 580 },
  { month: 'Jun', cycle: 4820, fees: 275, rewards: 620 },
  { month: 'Jul', cycle: 5240, fees: 310, rewards: 690 },
]

export const UTILIZATION_DATA = [
  { hour: '6 AM', washers: 15, dryers: 10 },
  { hour: '8 AM', washers: 45, dryers: 30 },
  { hour: '10 AM', washers: 70, dryers: 65 },
  { hour: '12 PM', washers: 85, dryers: 80 },
  { hour: '2 PM', washers: 75, dryers: 70 },
  { hour: '4 PM', washers: 90, dryers: 85 },
  { hour: '6 PM', washers: 95, dryers: 92 },
  { hour: '8 PM', washers: 60, dryers: 55 },
  { hour: '10 PM', washers: 30, dryers: 28 },
]

export const PLATFORM_MRR_DATA = [
  { month: 'Jan', mrr: 18200 },
  { month: 'Feb', mrr: 21400 },
  { month: 'Mar', mrr: 24800 },
  { month: 'Apr', mrr: 28100 },
  { month: 'May', mrr: 31500 },
  { month: 'Jun', mrr: 35200 },
  { month: 'Jul', mrr: 39800 },
]

export const STATUS_COLORS: Record<MachineStatus, string> = {
  available: 'text-success bg-success/10 border-success/20',
  'in-use': 'text-brand bg-brand/10 border-brand/20',
  locked: 'text-brand bg-brand/10 border-brand/20',
  overdue: 'text-warning bg-warning/10 border-warning/20',
  offline: 'text-muted-foreground bg-muted border-border',
  alert: 'text-destructive bg-destructive/10 border-destructive/20',
  reserved: 'text-secondary-foreground bg-secondary border-border',
}
