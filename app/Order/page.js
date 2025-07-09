import React, { Suspense } from 'react';
import Order from './OrderClient';

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Order...</div>}>
      <Order />
    </Suspense>
  );
}