import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import './Header.scss';

export default function Header({ children }) {
  return (
    <>
      <div className="header">
        <div className="logo">
<p className='text-3xl'>AIT</p>
          <span className="help-text mt-3">Meet</span>
        </div>
        <div className="action-btn">
          <button><FontAwesomeIcon className="icon-block" icon={faQuestionCircle} /></button>
          <button><FontAwesomeIcon className="icon-block" icon={faExclamationCircle} /></button>
          <button><FontAwesomeIcon className="icon-block" icon={faCog} /></button>
        </div>
      </div>
      <div className="body">
        <div className="left-side">
          <div className="content mr-10">
            <h2>Premium video meetings. Now free for everyone.</h2>
            <p>
              We re-engineered the service we built for secure business
              meetings, Google Meet, to make it free and available for all.
            </p>
            {children}
          </div>
          <div className="help-text">
            <a href="">Learn more</a> about AIT-Meet
          </div>
        </div>
        <div className="right-side">
          <div className="content">
          <img src={process.env.PUBLIC_URL + '/assets/meetImg.jpg'} alt="Meet" />
          </div>
        </div>
      </div>
    </>
  )
}