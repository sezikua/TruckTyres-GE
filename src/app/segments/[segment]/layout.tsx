import { ReactNode } from 'react';

interface SegmentLayoutProps {
  children: ReactNode;
}

export default function SegmentLayout({ children }: SegmentLayoutProps) {
  return <>{children}</>;
}
