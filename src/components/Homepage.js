import React, {Component} from 'react';
import axios from 'axios';
import { Panel, Table } from 'react-bootstrap';
import { url } from '../config';
import Searchbar from './Searchbar';
class Homepage extends Component{


	constructor(props){
		super(props);
		this.state ={
			asns: [],
			filteredAsns: [],
			firstLoad: true
			

		}
	}


	componentDidMount() {
    axios.get(`${url}/api/asns`)
         .then(res => res.data)
         .then(
           (data) => {  
             this.setState({
								 asns: data,
								 filteredAsns: data,
								 firstLoad: false
              });
            },
            (error) => {
              this.setState({
				asns: [],
				firstLoad: false
              })
            }
          ) 
}

_searchBarHandler = (searchTerm) => {
	const re = new RegExp(searchTerm.toString() + '.*', 'gi');
				let filteredAsns = this.state.asns.filter(record => {
					let asnId = Number(record.asn).toString();
					return asnId.match(re);
				});
				this.setState({
					filteredAsns
        });
}

formatAMPM = (expectedTime) => {
	let time = new Date("2020-03-25T10:10:00");
	let meridiem;
	let minutes = time.getMinutes();
	let hours = time.getHours();
	time.getHours() >= 12 ? meridiem = "pm" : meridiem = "am";
	if (minutes < 10) {minutes = `0${minutes}`};
	if (hours > 12) {hours = hours - 12};
	if (hours === 0) {hours = 12};
	let formattedTime = `${hours}:${minutes}${meridiem}`;
	return formattedTime;
}

formatDate = (expectedDate) => {
	let dateArr = expectedDate.split("-");
	return `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`
}

formatStatus = (status) => {
	return `${status[0].toUpperCase()}${status.substring(1)}`;
}

formatSerialStatus = (product) => {
	return product.delivered ? "Delivered" 
													 : product.received ? "Received" 
													 									  : "In-transit"
}


	render() {

		if (!this.props.isAuth) this.props.props.history.push('/');
		document.querySelector('body').style.backgroundColor = "white";
		const panelTitleStyles = {color: "rgba(77, 80, 85, 0.843)", display: "flex", justifyContent: "space-between", alignItems:"center"};
		const noResultsStyle = {fontFamily:'"Russo One", sans-serif', fontSize: "30px", color: "rgba(77, 80, 85, 0.843)", textAlign: "center", marginTop: "75px"};

	   let asnReturn = this.state.filteredAsns.map((aASN,index)=>{
		          return( <Panel id="collapsible-panel-example-3" key={aASN.asn}>
		          <Panel.Heading style={{fontFamily: '"Russo One", sans-serif', color:"rgba(77, 80, 85, 0.843)"}}>
		            <Panel.Title style={panelTitleStyles}>
									<h4 style={{color: "#01a2ff"}}>#{aASN.asn}</h4>
									<div>
									<Panel.Toggle style={{cursor: "pointer"}}	componentClass="a">Details</Panel.Toggle>
									</div>
								</Panel.Title>
								Expected Arrival Time: {this.formatAMPM(aASN.expectedArrivalTime)} {this.formatDate(aASN.expectedArrivalDate)}
								<br />
								Dock door: {aASN.dockDoor}
								<br />
								Status: <span className="asn-status">{this.formatStatus(aASN.status)}</span>
								<br />
		          </Panel.Heading>

		          <Panel.Collapse>
		            <Panel.Body>
								<Table striped bordered condensed hover>
									<thead>
										<tr>
											<th>Serial #</th>
											<th>Status</th>
										</tr>	
										</thead>
										<tbody>
                   {aASN.serials.map((aSerial, index)=>{
														 			return (<tr key={aASN.asn + aSerial.serial}>
																		 <td>{aSerial.serial}</td>
																		 <td>{this.formatSerialStatus(aSerial)}</td>
																	 </tr>)	 
													 })}
									 </tbody>
		             </Table>        
		            </Panel.Body>
		          </Panel.Collapse>
		          </Panel>)
	      
		 })
		 
		 if (this.state.firstLoad) asnReturn = (<h1 style={noResultsStyle}>Loading...</h1>)
		 else if (this.state.filteredAsns.length === 0) asnReturn = (<h1 style={noResultsStyle}>No Results</h1>)

          
		    return (
		    	   
                              
		      <div className="container-home">
						<Searchbar _searchBarHandler={this._searchBarHandler} />
                   {asnReturn}
		          
		        </div>)
		        
		        }
}




export default Homepage;

