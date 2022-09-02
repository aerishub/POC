import { matchPath, Link, useLocation } from "react-router-dom";
import { sub_menu_list } from "../../configurations/List";

export default function LeftMenu() {
  const { pathname } = useLocation();

  const getActiveClass = (className, path) => {
    if (matchPath(pathname, { path: path })) {
      return className + " active";
    }
    return className;
  };

  return (
    <div className="leftMenu">
      <ul>
        {sub_menu_list.map((item, index) => {
          return (
            <Link to={item.path} key={index}>
              <li className={getActiveClass(item.className, item.path)}>
                {item.title}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
