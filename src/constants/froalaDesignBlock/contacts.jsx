const contacts = [
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/1.jpg',
    content: (
      <section className="fdb-block pt-0">
        <div className="container-fluid p-0 pb-md-5">
          <iframe
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
            width="100%"
            height="300"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen=""
            title="map"
          ></iframe>
        </div>
        <div className="container">
          <div className="row mt-5">
            <div className="col-12 col-md-6 col-lg-5">
              <h2>Contact Us</h2>
              <p className="lead">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove.
              </p>

              <p className="lead">
                It is a paradisematic country, in which roasted parts of
                sentences fly into your mouth.
              </p>

              <p className="h3 mt-5">
                <strong>Email:</strong>{' '}
                <a href="https://www.froala.com">hello@website.com</a>
              </p>
              <p className="lead">
                <strong>Phone:</strong>{' '}
                <a href="https://www.froala.com">+44 123 123 1232</a>
              </p>
            </div>

            <div className="col-12 col-md-6 ml-auto pt-5 pt-md-0">
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/2.jpg',
    content: (
      <section
        className="fdb-block bg-dark"
        style={{
          backgroundImage: `url(/assets/plugins/froala-editor/hero/blue.svg)`
        }}
      >
        <div className="container">
          <div className="row text-center justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <h1>Contact Us</h1>
              <h2>We love to hear from you!</h2>
            </div>
          </div>

          <div className="row pt-4">
            <div className="col-12">
              <form>
                <div className="row">
                  <div className="col-12 col-md">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-12 col-md mt-4 mt-md-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-12 col-md mt-4 mt-md-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone (optional)"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col text-center">
                    <button type="submit" className="btn btn-dark">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/3.jpg',
    content: (
      <section className="fdb-block">
        <div className="container">
          <div className="row text-center justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <h1>Contact Us</h1>
              <p className="lead">
                One day however a small line of blind text by the name of Lorem
                Ipsum decided to leave for the far World of Grammar.
              </p>
            </div>
          </div>

          <div className="row pt-4">
            <div className="col-12 col-md-6">
              <iframe
                className="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
                width="100%"
                height="300"
                frameborder="0"
                style={{ border: 0 }}
                allowfullscreen=""
                title="map"
              ></iframe>
            </div>

            <div className="col-12 col-md-6 pt-5 pt-md-0">
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/4.jpg',
    content: (
      <section className="fdb-block py-0">
        <div
          className="container py-5 my-5"
          style={{
            backgroundImage: `url(/assets/plugins/froala-editor/shapes/9.svg)`
          }}
        >
          <div className="row py-5">
            <div className="col py-5">
              <div className="fdb-box fdb-touch">
                <div className="row text-center justify-content-center">
                  <div className="col-12 col-md-9 col-lg-7">
                    <h1>Contact Us</h1>
                    <p className="lead">
                      Pityful a rethoric question ran over her cheek, then she
                      continued her way. On her way she met a copy.
                    </p>
                  </div>
                </div>

                <div className="row justify-content-center pt-4">
                  <div className="col-12 col-md-8">
                    <form>
                      <div className="row">
                        <div className="col-12 col-md">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                          />
                        </div>
                        <div className="col-12 col-md mt-4 mt-md-0">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Subject"
                          />
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col">
                          <textarea
                            className="form-control"
                            name="message"
                            rows="3"
                            placeholder="How can we help?"
                          ></textarea>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col text-center">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/5.jpg',
    content: (
      <section className="fdb-block pt-0">
        <div className="container-fluid p-0 pb-3">
          <iframe
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
            width="100%"
            height="300"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen=""
            title="map"
          ></iframe>
        </div>
        <div className="container">
          <div className="row text-center justify-content-center pt-5">
            <div className="col-12 col-md-7">
              <h1>Contact Us</h1>
            </div>
          </div>

          <div className="row justify-content-center pt-4">
            <div className="col-12 col-md-7">
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col text-center">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row-100"></div>
        </div>
        <div className="bg-dark">
          <div className="container">
            <div className="row-50"></div>
            <div className="row justify-content-center text-center">
              <div className="col-12 col-md mr-auto ml-auto">
                <img
                  alt="phone"
                  height="40"
                  className="mb-2"
                  src="/assets/plugins/froala-editor/icons/phone.svg"
                />
                <p className="lead">+44 (112) 123 752</p>
              </div>

              <div className="col-12 col-md pt-4 pt-md-0 mr-auto ml-auto">
                <img
                  alt="navigation"
                  height="40"
                  className="mb-2"
                  src="/assets/plugins/froala-editor/icons/navigation.svg"
                />
                <p className="lead">
                  123 6th St.
                  <br />
                  Melbourne, FL 32904
                </p>
              </div>

              <div className="col-12 col-md pt-4 pt-md-0 mr-auto ml-auto">
                <img
                  alt="mail"
                  height="40"
                  className="mb-2"
                  src="/assets/plugins/froala-editor/icons/mail.svg"
                />
                <p className="lead">support@website.com</p>
              </div>
            </div>
            <div className="row-50"></div>
          </div>
        </div>

        <div className="container">
          <div className="row-70"></div>
          <div className="row text-center">
            <div className="col">
              <p className="h2">
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-facebook fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i className="fab fa-twitter fr-deletable" aria-hidden="true">
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-instagram fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i className="fab fa-google fr-deletable" aria-hidden="true">
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-pinterest fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/6.jpg',
    content: (
      <section className="fdb-block pt-0">
        <div className="container-fluid p-0 pb-5">
          <iframe
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
            width="100%"
            height="300"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen=""
            title="map"
          ></iframe>
        </div>
        <div className="container">
          <div className="row pt-5">
            <div className="col-12">
              <form>
                <div className="row">
                  <div className="col-12 col-md">
                    <label>First Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-12 col-md mt-4 mt-md-0">
                    <label>Last Name</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <label>Your Email</label>
                    <input type="email" className="form-control" />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <label>Subject (optional but helpful)</label>
                    <input type="email" className="form-control" />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <label>How can we help?</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4 text-center">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/7.jpg',
    content: (
      <section className="fdb-block py-0">
        <div
          className="container py-5"
          style={{
            backgroundImage: `url(/assets/plugins/froala-editor/shapes/6.svg)`
          }}
        >
          <div className="row text-center justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <h1>Contact Us</h1>
              <p className="lead">
                If you’re already an active user, please{' '}
                <a href="https://www.froala.com">sign in</a> before contacting
                us.
              </p>
            </div>
          </div>
          <div className="row-50"></div>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <form>
                <div className="row">
                  <div className="col">
                    <label>Your Email Address</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <label>Subject (optional but helpful)</label>
                    <input type="email" className="form-control" />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <label>How can we help?</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col text-right">
                    <button type="submit" className="btn btn-dark">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row-100"></div>
        </div>

        <div className="container-fluid p-0">
          <iframe
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
            width="100%"
            height="300"
            frameborder="0"
            style={{ border: 0 }}
            allowfullscreen=""
            title="map"
          ></iframe>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/8.jpg',
    content: (
      <section
        className="fdb-block pt-0"
        style={{
          backgroundImage: `url(/assets/plugins/froala-editor/shapes/8.svg)`
        }}
      >
        <div className="bg-gray">
          <div className="container">
            <div className="row-100"></div>
            <div className="row text-left">
              <div className="col-8">
                <h1>Contact Us</h1>
                <p className="lead">
                  Far far away, behind the word mountains, far from the
                  countries Vokalia and Consonantia, there live the blind texts.
                </p>
              </div>
            </div>
            <div className="row-100"></div>
          </div>
        </div>
        <div className="container bg-r">
          <div className="row-100"></div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-5">
              <h2>Call or email</h2>
              <p className="text-large">
                Support, Sales, and Account Management services are currently
                available in English
              </p>

              <p className="h3 mt-4 mt-lg-5">
                <strong>Support</strong>
              </p>
              <p>+800 3005 4300</p>
              <p>
                <a href="https://www.froala.com">Contact Support</a>
              </p>
              <p>
                Our technical support is available by phone or email from 11am
                to 11pm BST, Monday through Friday.
              </p>

              <p className="h3 mt-4 mt-lg-5">
                <strong>Sales</strong>
              </p>
              <p>+800 3005 4300</p>
              <p>
                <a href="https://www.froala.com">Contact Sales</a>
              </p>
              <p>
                Our technical support is available by phone or email from 11am
                to 11pm BST, Monday through Friday.
              </p>

              <p className="h3 mt-4 mt-lg-5">
                <strong>General inquiries</strong>
              </p>
              <p>
                <a href="https://www.froala.com">hello@website.com</a>
              </p>
            </div>

            <div className="col-12 col-md-6 ml-auto">
              <h2>Drop us a line</h2>
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <select className="form-control" required="">
                      <option value="">Select Department</option>
                      <option value="1">Support</option>
                      <option value="2">Sales</option>
                      <option value="3">Accounting</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="5"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/9.jpg',
    content: (
      <section className="fdb-block bg-gray">
        <div className="container">
          <div className="row text-center justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <p className="h2">support@website.com</p>
              <p className="lead">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts.
              </p>
              <p>
                <br />
              </p>
              <p className="h2">
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-facebook fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i className="fab fa-twitter fr-deletable" aria-hidden="true">
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-instagram fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i className="fab fa-google fr-deletable" aria-hidden="true">
                    &nbsp;
                  </i>
                </a>
                <a href="https://www.froala.com" className="mx-2">
                  <i
                    className="fab fa-pinterest fr-deletable"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  },
  {
    thumbnail: '/assets/plugins/froala-editor/thumbnail/contacts/10.jpg',
    content: (
      <section className="fdb-block">
        <div className="container">
          <div className="row text-center justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              <h1>Contact Us</h1>
              <p className="lead">
                Separated they live in Bookmarksgrove right at the coast of the
                Semantics, a large language ocean.
              </p>
            </div>
          </div>
          <div className="row-70"></div>
          <div className="row">
            <div className="col-12 col-md-8 col-lg m-auto">
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <textarea
                      className="form-control"
                      name="message"
                      rows="3"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-12 col-md-8 col-lg pt-5 m-auto pt-lg-0">
              <iframe
                className="mb-4"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388087937!2d26.101253041406952!3d44.43635311654287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2zR3J1cHVsIFN0YXR1YXIgIkPEg3J1yJthIEN1IFBhaWHIm2Ui!5e0!3m2!1sen!2sro!4v1507381157656"
                width="100%"
                height="200"
                frameborder="0"
                style={{ border: 0 }}
                allowfullscreen=""
                title="map"
              ></iframe>

              <p>
                <strong>Showroom</strong>
              </p>
              <p>
                71 Pilgrim Avenue
                <br />
                Chevy Chase, MD 20815
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
]

export default contacts
