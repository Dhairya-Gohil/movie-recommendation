import "./MainLayout.css";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

function MainLayout({ children }) {
    return (
        <>
            <Navbar />

            <main className="main-layout">

                {children}

            </main>

            <Footer />
        </>
    );
}

export default MainLayout;