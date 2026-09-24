import Navbar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "./MainLayout.css";

function MainLayout({ children }) {
    return (
        <>
            <Navbar />

            <main className="main-content">
                {children}
            </main>

            <Footer />
        </>
    );
}

export default MainLayout;