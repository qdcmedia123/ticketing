interface OrderTemplate {
  name: string | null;
  email: string | null;
  orderID: string;
  amount: number;
}

export const OrderConfirmedTemplate = (props: OrderTemplate): string => {
  return `<div>
    <b>Hi ${props.name}, Thank you for your order. <br/>
    <b>Order Id: ${props.orderID}</b> <br/>
    <b>Amount: ${props.amount}</b>
</b>
    </div>`;
};
