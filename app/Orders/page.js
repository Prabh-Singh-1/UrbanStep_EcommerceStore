import React, { Suspense } from 'react';
import Orders from './OrdersClient';

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Orders...</div>}>
      <Orders />
    </Suspense>
  );
}