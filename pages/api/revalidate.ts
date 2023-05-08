import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook';

const handler = async (req: { headers: { [x: string]: { toString: () => any; }; }; body: { id: any; slug: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { msg?: string; err?: string; }): void; new(): any; }; }; revalidate: (arg0: string) => any; }) => {
    const secret = process.env.SANITY_WEBHOOK_SECRET
//authenticating the webhook
  try {
    const signature = req.headers[SIGNATURE_HEADER_NAME].toString();

    if (
      !isValidSignature(
        JSON.stringify(req.body),
        signature,
        'secret'
      )
    )
      return res.status(401).json({ msg: 'Invalid request!' });

    //getting payload
    const { id, slug } = req.body;
    await res.revalidate(`/agency`);
    await res.revalidate(`/brands`);
    await res.revalidate(`/`);
    await res.revalidate(`/contact`);
    await res.revalidate(`/legal`);
    await res.revalidate(`/brands/${slug}`);
    await res.revalidate(`/brands/skall-studio`);

    
    res.status(200).json({ msg: 'Product pages revalidated.' });
  } catch (error) {
    res.status(500).json({ err: 'Something went Wrong!' });
  }
};

export default handler;