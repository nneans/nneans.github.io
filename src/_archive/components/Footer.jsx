function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <p className="footer-text">
                    © {currentYear} 강민균. Built with <span className="heart">♥</span> using React + Vite
                </p>
            </div>
        </footer>
    )
}

export default Footer
