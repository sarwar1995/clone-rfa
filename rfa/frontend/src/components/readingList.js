import React, { Component } from "react";
import PaperReference from "./searchResults";

class ReadingList extends Component {

    constructor(props) {
        super(props);
    }

    generatePaperReferences(DOIs) {
        let paperReferenceItems;
        // TODO: Look up data for each DOI and
        //       create PaperReference elements
        paperReferenceItems = DOIs.map((DOI) =>
                DOI + ' '
        );
        
        return paperReferenceItems;
    }

    render() {
        return (
            <div className="purpleBox">
                <div className="row">
                    <div className="column middle">
                        {this.props.data.name}
                    </div>
                </div>
                <div className="row">
                    <div className="column middle">
                        {/* {this.props.data.DOIs} */}
                        {this.generatePaperReferences(this.props.data.DOIs)}
                    </div>
                </div>
            </div>
        )
    }
}
export default ReadingList;