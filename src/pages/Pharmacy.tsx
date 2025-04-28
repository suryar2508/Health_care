import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const medicines = [
  { id: 1, name: "Aspirin", price: 5.99, stock: 100 },
  { id: 2, name: "Ibuprofen", price: 7.99, stock: 150 },
  { id: 3, name: "Paracetamol", price: 4.99, stock: 200 },
  { id: 4, name: "Amoxicillin", price: 12.99, stock: 50 },
  { id: 5, name: "Omeprazole", price: 9.99, stock: 75 },
];

const Pharmacy = () => {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  const addToCart = (medicineId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicineId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === medicineId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { id: medicineId, quantity: 1 }];
      }
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const medicine = medicines.find((m) => m.id === item.id);
      return total + (medicine ? medicine.price * item.quantity : 0);
    }, 0);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pharmacy Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Medicines</CardTitle>
              <CardDescription>Select medicines to add to the cart</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {medicines.map((medicine) => (
                  <li key={medicine.id} className="flex justify-between items-center">
                    <span>{medicine.name} - ${medicine.price}</span>
                    <Button onClick={() => addToCart(medicine.id)}>Add to Cart</Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
              <CardDescription>Review your cart and proceed to billing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cart.map((item) => {
                  const medicine = medicines.find((m) => m.id === item.id);
                  return (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{medicine ? medicine.name : ""} x {item.quantity}</span>
                      <span>${medicine ? (medicine.price * item.quantity).toFixed(2) : "0.00"}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 text-right">
                <strong>Total: ${calculateTotal().toFixed(2)}</strong>
              </div>
              <Button className="mt-4 w-full">Proceed to Billing</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Pharmacy; 