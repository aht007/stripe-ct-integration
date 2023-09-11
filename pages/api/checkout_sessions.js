const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import getProducts from '../../utils/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const ct_products = await getProducts();
            console.log(ct_products);
            // select one product randomly from the products array
            const product = ct_products.body.results[Math.floor(Math.random() * ct_products.body.results.length)];
            console.log(product);
            console.log(product.masterData.current.name.en);
            console.log(product.masterData.current.masterVariant);
            console.log(product.masterData.current.masterVariant.prices);

            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.masterData.current.name['en-US'],
                                images: [product.masterData.current.masterVariant.images[0].url],
                            },
                            unit_amount: product.masterData.current.masterVariant.prices[0].value.centAmount,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            });
            res.redirect(303, session.url);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
