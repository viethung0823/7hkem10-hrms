import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import Employee from "./Employee";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import EmployeeDetail from "./EmployeeDetail";
import EmployeeNew from "./EmployeeNew";
import EmployeeEdit from "./EmployeeEdit";
import Role from "./Role";
import RoleNew from "./RoleNew";
import RoleEdit from "./RoleEdit";
import ContractType from "./ContractType";
import ContractTypeNew from "./ContractTypeNew";
import ContractTypeEdit from "./ContractTypeEdit";
import Contract from "./Contract";
import ContractNew from "./ContractNew";
import ContractDetail from "./ContractDetail";
import ContractEdit from "./ContractEdit";
import JobTitle from "./JobTitle";
import JobTitleNew from "./JobTitleNew";
import JobTitleDetail from "./JobTitleDetail";
import JobTitleEdit from "./JobTitleEdit";
import User from "./User";
import UserNew from "./UserNew";
import UserDetail from "./UserDetail";
import UserEdit from "./UserEdit";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => ( <> <Preloader show={loaded ? false : true} /> <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
        </main>
      </>
    )}
    />
  );
};

export default () => (
  <Switch>
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} />
    <RouteWithSidebar exact path={Routes.Employee.path} component={() => <Employee title="Employee Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.EmployeeNew.path} component={EmployeeNew} />
    <RouteWithSidebar exact path={Routes.EmployeeDetail.path} component={EmployeeDetail} />
    <RouteWithSidebar exact path={Routes.EmployeeEdit.path} component={EmployeeEdit} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
    <RouteWithSidebar exact path={Routes.User.path} component={() => <User title="User Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.UserNew.path} component={UserNew} />
    <RouteWithSidebar exact path={Routes.UserDetail.path} component={UserDetail} />
    <RouteWithSidebar exact path={Routes.UserEdit.path} component={UserEdit} />
    <RouteWithSidebar exact path={Routes.UserRole.path} component={() => <Role title="Role Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.UserRoleNew.path} component={RoleNew} />
    <RouteWithSidebar exact path={Routes.UserRoleEdit.path} component={RoleEdit} />
    <RouteWithSidebar exact path={Routes.ContractType.path} component={() => <ContractType title="Contract Type Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.ContractTypeNew.path} component={ContractTypeNew} />
    <RouteWithSidebar exact path={Routes.ContractTypeEdit.path} component={ContractTypeEdit} />
    <RouteWithSidebar exact path={Routes.Contract.path} component={() => <Contract title="Contract Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.ContractNew.path} component={ContractNew} />
    <RouteWithSidebar exact path={Routes.ContractDetail.path} component={ContractDetail} />
    <RouteWithSidebar exact path={Routes.ContractEdit.path} component={ContractEdit} />
    <RouteWithSidebar exact path={Routes.JobTitle.path} component={() => <JobTitle title="Job Title Management" showSearch={true} showSettings={true} />} />
    <RouteWithSidebar exact path={Routes.JobTitleNew.path} component={JobTitleNew} />
    <RouteWithSidebar exact path={Routes.JobTitleDetail.path} component={JobTitleDetail} />
    <RouteWithSidebar exact path={Routes.JobTitleEdit.path} component={JobTitleEdit} />

    {/* components */}
    <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} />
    <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
    <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
    <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} />
    <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
    <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
    <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
    <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
    <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
    <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} />
    <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
    <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
    <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
    <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
    <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
    <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

    {/* documentation */}
    <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} />
    <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} />
    <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} />
    <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} />
    <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} />
    <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} />
    <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} />

    <Redirect to={Routes.NotFound.path} />
  </Switch>
);
