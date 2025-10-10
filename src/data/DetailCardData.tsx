export {};

export function getCardData(cardId: string) {
    if (!cardData.has(cardId)) {
        return null;
    }

    return cardData.get(cardId);
}

const cardData = new Map([
    ['about', {
        data: (
        <div className="card-data-about" style={{textAlign: 'left'}}>
            <p className="body-text">
                Welcome to my portfolio! I'm a software developer based in Osaka, Japan. I originally 
                studied 3D graphics programming/game development at Abertay University, Dundee, and 
                after graduating worked in 3D development, primarily within the VR industry.<br /> <br />
                
                I have recently been expanding my skills into web development, primarily focusing on front-end.<br /> <br />

                This website contains information on my past professional experience, as well as 
                more recent projects using web development technologies. 
            </p>
        </div>
        )
    }],
    ['experience', {
        data: (
        <div className="card-data-experience" style={{textAlign: 'left'}}>
            <h3>Immerse - Senior Unity Developer (2020-2025)</h3>
            <p className="body-text">
                At Immerse I worked as a member of the solutions team. This involved working on many projects covering a range of
                industries and clients. These projects were for developing 3D VR applications for various purposes, usually for
                workplace process training, but also for marketing, education and workplace health and safety. These
                applications were both single and multi-user, supported VR and WebGL platforms and were in multiple
                languages.
            </p>
            <span className='underline' style={{
                display: 'inline-block',
                width: '100%',
                height: `${2}px`,
                backgroundColor: 'white',
            }}></span>
            <h3>Symphony Retail AI - Unity Developer (2016 - 2020)</h3>
            <p className="body-text">
                I worked as a Unity Developer as part of the Symphony Retail AI Innovation studio to primarily develop 3D
                visualization software of retail environments in a small team. This work involves not just Desktop/WebGL Unity
                development but also back-end Database (SQL Server) work.
            </p>
        </div>
        )
    }],
    ['contact', {
        data: (
        <div className="card-data-contact" style={{textAlign: 'left'}}>
            <div className="contact-block">
                <h3>Email: </h3>
                <p className="body-text">evanmclay24@gmail.com</p>
            </div>
            <div className="contact-block">
                <h3>Linkedin: </h3>
                <a href="https://www.linkedin.com/in/evan-mclay-3642a0106" rel="noreferrer" target="_blank" className="body-text-link">https://www.linkedin.com/in/evan-mclay-3642a0106</a>
            </div>
            <div className="contact-block">
                <h3>Github: </h3>
                <a href="https://github.com/Distant-Skyline-Xtal" rel="noreferrer" target="_blank" className="body-text-link">https://github.com/Distant-Skyline-Xtal</a>
            </div>
        </div>
        )
    }],
]);