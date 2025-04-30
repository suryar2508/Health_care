import { ReactNode } from 'react';

export interface PageProps {
  children?: ReactNode;
}

// Admin Pages
export interface AdminDashboardProps extends PageProps {}
export interface AdminPatientsProps extends PageProps {}
export interface AdminAppointmentsProps extends PageProps {}
export interface AdminPrescriptionsProps extends PageProps {}

// Doctor Pages
export interface DoctorDashboardProps extends PageProps {}
export interface DoctorPatientsProps extends PageProps {}
export interface DoctorAppointmentsProps extends PageProps {}
export interface DoctorPrescriptionsProps extends PageProps {}

// Patient Pages
export interface PatientDashboardProps extends PageProps {}
export interface PatientHealthMonitoringProps extends PageProps {}
export interface PatientAppointmentsProps extends PageProps {}
export interface PatientPrescriptionsProps extends PageProps {}

// Pharmacist Pages
export interface PharmacyDashboardProps extends PageProps {}
export interface PharmacyInventoryProps extends PageProps {}
export interface PharmacyPrescriptionsProps extends PageProps {} 