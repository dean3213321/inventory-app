import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styling/Dashboard.css';

const Dashboard = () => {
    const [showMain, setShowMain] = useState(false);
    const [showWithID, setShowWithID] = useState(false);
    const [showWithoutID, setShowWithoutID] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [showFinalModal, setShowFinalModal] = useState(false);

    // States for the product modal
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    // States for user details and RFID (WITH ID mode)
    const [userDetails, setUserDetails] = useState({ fname: '', lname: '', availableCredits: 0 });
    const [rfid, setRfid] = useState('');

    // States for manual input in WITHOUT ID mode
    const [manualFname, setManualFname] = useState('');
    const [manualLname, setManualLname] = useState('');

    // Function to clear the forms after a transaction
    const clearForms = () => {
        setRfid('');
        setUserDetails({ fname: '', lname: '', availableCredits: 0 });
        setManualFname('');
        setManualLname('');
        setSelectedProduct('');
        setQuantity(1);
        setTotalPrice(0);
    };

    // Initial modal: choose between WITH ID or WITHOUT ID
    const handleIconClick = () => {
        setShowMain(true);
    };

    const handleWithID = () => {
        setShowMain(false);
        setShowWithID(true);
    };

    const handleWithoutID = () => {
        setShowMain(false);
        setShowWithoutID(true);
    };

    const handleClose = () => {
        setShowMain(false);
        setShowWithID(false);
        setShowWithoutID(false);
        setShowProduct(false);
        setShowFinalModal(false);
    };

    const handleBackToMain = () => {
        setShowWithoutID(false);
        setShowMain(true);
    };

    // Transition to the product modal after RFID scan or manual input
    const handleNextFromRFID = async () => {
        try {
            const response = await fetch(`/api/user/${rfid}`);
            const data = await response.json();
            if (response.ok) {
                setUserDetails(data);
                setShowWithID(false);
                setShowProduct(true);
            } else {
                console.error('Error fetching user details:', data.error);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleNextFromDetails = () => {
        // For WITHOUT ID, the entered names will be used in the final modal.
        setShowWithoutID(false);
        setShowProduct(true);
    };

    // Fetch products from your API when the product modal is shown.
    useEffect(() => {
        if (showProduct) {
            fetch('/api/products')
                .then((res) => res.json())
                .then((data) => {
                    setProducts(data);
                    if (data.length > 0) {
                        setSelectedProduct(data[0].id);  // Default to first product
                    }
                })
                .catch((err) => console.error('Error fetching products:', err));
        }
    }, [showProduct]);

    // Update total price whenever quantity or selected product changes.
    useEffect(() => {
        const product = products.find((p) => p.id === parseInt(selectedProduct, 10));
        if (product) {
            setTotalPrice(product.selling_price * quantity);
        }
    }, [quantity, selectedProduct, products]);

    const handleProductChange = (e) => {
        setSelectedProduct(e.target.value);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0) { // Validate input
          setQuantity(value);
        }
    };

    // When submitting the product, simply move to the final modal.
    const handleProductSubmit = () => {
        handleFinalSubmit(); //  This is correct, just moves to the final modal
    };

    const handleFinalSubmit = () => {
        setShowProduct(false);
        setShowFinalModal(true);
    };


    const handleBackFromProduct = () => {
        setShowProduct(false);
        setShowMain(true); // Corrected to go back to the main selection
    };
    // When confirming the transaction, process debit (for WITH ID) or just clear the forms (for WITHOUT ID).
    const handleConfirmTransaction = async () => {
      if (rfid) {
        try {
          const response = await fetch(`/api/user/${rfid}/debit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: totalPrice })
          });

          if (response.ok) {
            const data = await response.json(); // Get the updated credits from the response
            setUserDetails(prevDetails => ({ ...prevDetails, availableCredits: data.availableCredits })); // Update credits
            clearForms();
            handleClose();
          } else {
            const errorData = await response.json(); // Get error details
            console.error('Error subtracting credits:', errorData.error);
            // Optionally, show an error message to the user using a state (e.g., setErrorMessage(errorData.error))
          }
        } catch (error) {
          console.error('Error subtracting credits:', error);
          // Optionally, show an error message to the user
        }
      } else {
        // WITHOUT ID mode: simply clear forms and close.
        clearForms();
        handleClose();
      }
    };

    // Determine final display name based on mode (WITH ID vs WITHOUT ID)
    const finalUserName = rfid
        ? `${userDetails.fname} ${userDetails.lname}`
        : `${manualFname} ${manualLname}`;

    return (
        <div className="dashboard-page">
            <div className="dashboard-icon" onClick={handleIconClick}>
                <i className="bi bi-cart3"></i>
            </div>

            {/* Main Modal: Choose between WITH ID or WITHOUT ID */}
            <Modal show={showMain} onHide={handleClose} centered className='modal1'>
                <Modal.Header closeButton>
                    <Modal.Title>Select an Option</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-around">
                    <Button variant="primary" onClick={handleWithID}>
                        WITH ID
                    </Button>
                    <br />
                    <Button variant="secondary" onClick={handleWithoutID}>
                        WITHOUT ID
                    </Button>
                </Modal.Body>
            </Modal>

            {/* WITH ID Modal: RFID scanner input */}
            <Modal show={showWithID} onHide={handleClose} centered className='modal2'>
                <Modal.Header closeButton>
                    <Modal.Title>RFID Scanner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        autoFocus
                        className="form-control"
                        placeholder="Scan RFID..."
                        value={rfid}
                        onChange={(e) => setRfid(e.target.value)}
                    />
                    <Button variant="primary" className="mt-3" onClick={handleNextFromRFID}>
                        Next
                    </Button>
                </Modal.Body>
            </Modal>

            {/* WITHOUT ID Modal: First and Last name inputs */}
            <Modal show={showWithoutID} onHide={handleClose} centered className='modal3'>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="First Name"
                        value={manualFname}
                        onChange={(e) => setManualFname(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Last Name"
                        value={manualLname}
                        onChange={(e) => setManualLname(e.target.value)}
                    />
                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="secondary" onClick={handleBackToMain}>
                            Back
                        </Button>
                        <Button variant="primary" onClick={handleNextFromDetails}>
                            Next
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Product Modal: Select product, enter quantity, view total price */}
            <Modal show={showProduct} onHide={handleClose} centered className='modal4'>
                <Modal.Header closeButton>
                    <Modal.Title>Select Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Product Name</label>
                        <select className="form-control" value={selectedProduct} onChange={handleProductChange}>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mt-2">
                        <label>Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Total Price</label>
                        <input type="text" className="form-control" value={totalPrice} readOnly />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleBackFromProduct}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleProductSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Final Modal: Display user details (name), selected product, and total amount */}
            <Modal show={showFinalModal} onHide={handleClose} centered className='modal5'>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>User Name</label>
                        <input type="text" className="form-control" value={finalUserName} readOnly />
                    </div>
                    {rfid && (
                        <div className="form-group mt-2">
                            <label>Available Credits</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userDetails.availableCredits}
                                readOnly
                            />
                        </div>
                    )}
                    <div className="form-group mt-2">
                        <label>Selected Product</label>
                        <input
                            type="text"
                            className="form-control"
                            value={products.find((p) => p.id === parseInt(selectedProduct, 10))?.item || ''}
                            readOnly
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Total Amount</label>
                        <input type="text" className="form-control" value={totalPrice} readOnly />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirmTransaction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Dashboard;