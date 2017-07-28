import Visualization from './scripts/Visualization';
import $ from 'jquery';

import 'c3/c3.min.css';
import './stylesheets/main.scss';


// Fill username
var username = window.location.href.split("?")[1];
$("#username").html(username);

// Load visualization
const visualization = new Visualization();
