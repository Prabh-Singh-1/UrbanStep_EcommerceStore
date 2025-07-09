import React, { Suspense } from 'react';
import MyAccount from './MyAccountClient';

export default function MyAccountPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Account...</div>}>
      <MyAccount />
    </Suspense>
  );
}