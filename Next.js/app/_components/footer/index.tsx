import "./footer.scss";
import { LinkStyle } from "../link";
import CustomLink from "../link";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Created by&nbsp;
        <CustomLink href="https://jamescoolidge.com" type={LinkStyle.icon}>
          James Coolidge
        </CustomLink>
      </p>
    </footer>
  );
}
