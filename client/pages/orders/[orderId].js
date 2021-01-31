import {useState, useEffect} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    // Get the expire date from the order 
    const {doRequest, errors} = useRequest({
        'url': '/api/payments',
        'method':'post',
        'body': {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    useEffect(() => {
        const remainingTime = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        }
        // Create interval so It will run each secound 
        // Set interval will run only after 1 secound 
        // Therefore invoke the function first time 
        remainingTime();
        const timerId = setInterval(remainingTime, 1000);

        // Time will run forever thefore clear the interval 
        return () => {
            clearInterval(timerId);
        }
    }, [order])
   
    if(timeLeft < 0) {
        return <div>Order expired</div>
    }
    return <div>Time left to pay: {timeLeft} secounds <br/>
    <StripeCheckout
        token = {(token) => doRequest({token:token.id})}
        stripeKey = 'pk_test_5eCrZUNWnbmLG8iLe6wILAsy008tnT6WEo'
        amount={order.ticket.price}
        email={currentUser.email}
    />
    {errors}
    </div>
}

OrderShow.getInitialProps = async(context, client) => {
    // Get the query 
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
}

export default OrderShow;