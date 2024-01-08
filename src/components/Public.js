import FooterPublic from './FooterPublic';

const Public = () => {
    const content = (
        <section className="flex flex-col justify-between mx-auto bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen">
            <header>
                <h1 className="p-4 text-5xl font-extrabold dark:text-white">
                    Welcome to Dan D. Repairs!
                </h1>
            </header>
            <main className="flex flex-col flex-1 justify-between p-4">
                <p className="text-2xl font-bold dark:text-white">
                    Located in Beautiful Downtown Foo City,
                    <br />
                    Dan D. Repairs provides a trained staff
                    <br />
                    ready to meet your tech repair needs.
                </p>

                <div className="">
                    <address className="mt-8">
                        Dan D. Repairs
                        <br />
                        555 Foo Drive
                        <br />
                        Foo City, CA 12345
                        <br />
                        <a href="tel:+15555555555">(555) 555-5555</a>
                    </address>

                    <br />
                    <p>Owner: Dan Davidson</p>
                </div>
            </main>
            <footer>
                <FooterPublic path={'/login'} name={'LogIn'} />
            </footer>
        </section>
    );
    return content;
};
export default Public;
