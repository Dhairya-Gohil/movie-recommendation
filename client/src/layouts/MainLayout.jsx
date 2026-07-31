import Navbar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

function MainLayout({ children }) {

    return (
        <>
            <Navbar />

            <main
                style={{
                    minHeight: "85vh",
                    padding: "30px"
                }}
            >
                {children}
            </main>

            <Footer />
        </>
    );

}

export default MainLayout;