import logo from '../wesLogo.png'
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
    return ( 
        <div className="navbar">

                    <div className='boxlogo'>
                        <i class="bi bi-boxes"></i>
                    </div>

                    <div className='burgericon'>
                        <i class="bi bi-list"></i>
                    </div>

                 <div className='wislogo'>
                     <img src={logo} className='wis-logo'></img>
                </div>


                <div className="user-info">
                    <i className="bi bi-person-circle user-icon"></i>
                </div>
        </div>

     );
}
 
export default Navbar;