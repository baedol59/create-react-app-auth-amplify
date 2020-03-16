import React from 'react'

export default function HomeContent() {
  return (
    <section className="container">
        <div className="columns features">
            <div className="column is-4">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                            <h4>OWL News 1 </h4>
                            <p>content..</p>
                            <p><a href="/">..more</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-4">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                        <h4>OWL News 2 </h4>
                        <p>content..</p>
                        <p><a href="/">..more</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-4">
                <div className="card is-shady">
                     <div className="card-content">
                        <div className="content">
                        <h4>OWL News 3 </h4>
                        <p>content..</p>
                        <p><a href="/">..more</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
