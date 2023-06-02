import "./footer.scss";
import { linkStyle } from "../link";
import CustomLink from "../link";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Created by&nbsp;
        <CustomLink href="https://jamescoolidge.com" type={linkStyle.icon}>
          James Coolidge
        </CustomLink>
      </p>
    </footer>
  );
}
