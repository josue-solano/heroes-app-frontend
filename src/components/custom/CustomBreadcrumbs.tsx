import { Link, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

interface Breadcrumb {
  to: string;
  label: string;
}

interface Props {
  routes: Array<Breadcrumb>;
}

export const CustomBreadcrumbs = ({ routes }: Props) => {
  const { pathname } = useLocation();

  return (
    <Breadcrumb className="my-5">
      <BreadcrumbList>
        {routes.map((item) =>
          item.to != pathname ? (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
            </Fragment>
          ) : (
            <BreadcrumbItem key={item.label}>
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
