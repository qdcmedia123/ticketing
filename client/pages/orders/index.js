import OrderShow from "./[orderId]"

const OrderIndex = ({orders}) => {

    return <ul>
        {orders.map(order => <li kye = {order.id}>
            {order.ticket.title}
        </li>)}
    </ul>
}

OrderIndex.getInitialProps = async(context, client) => {
    const {data} = await client.get('/api/orders');
    return {orders:data};
}

export default OrderIndex;