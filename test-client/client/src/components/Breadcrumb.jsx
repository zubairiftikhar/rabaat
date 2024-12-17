import { Link, useLocation } from "react-router-dom";
import './componentstyle.css';

function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(x => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {paths.map((path, index) => {
          const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
          return (
            <li key={path} className="breadcrumb-item">
              <Link to={routeTo}>{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
