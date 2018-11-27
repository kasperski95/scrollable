import React, { Component } from 'react'
import styled from 'styled-components'

var theme = {
	gutter: 8
}

const CustomScrollbarWrapper = styled.div`
	width: ${theme.gutter*2}px;
	height: 100%;
	background-color: #0D0;
	position: absolute;
	top: 0;
	right: 0;
	z-index: 90;
`;

const CustomScrollbarFiller = styled.div`
	width: 100%;
	height: 100%;
	background-color: #00D;
	position: relative;
`;

const CustomScrollbarElement = styled.div`
	width: 100%;
	height: ${props => props.height || "100%"};
	background-color: #0D0;
	position: absolute;
	top: 0;
	left: 0;
`;

const Content = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	overflow: scroll;
	position: relative;
`;

const ScrollWrapper = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	position: relative;
	overflow: hidden;
`;

const DefaultScrollHider = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	overflow: hidden;
`;



export default class Scrollbar extends Component {
	constructor() {
		super();
		this.dragEnabled = false;
		this.prevMouseDownPosY = 0;

		this.Wrapper = React.createRef();
		this.Content = React.createRef();
		this.Thumb = React.createRef();
		this.Dummmy = React.createRef();

		this.handleScroll = this.handleScroll.bind(this);
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
		this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
		this.handleOnDragStart = this.handleOnDragStart.bind(this);
	}

	findScrollbarWidth() {
		let dummy = document.getElementById('scrollbarDummy');
		if (!dummy) {
			let wrapper = document.createElement('div');
			wrapper.style.cssText = 'position:absolute;top:0px;width:100px;visibility:hidden;overflow:scroll';
			dummy = document.createElement('div');
			dummy.setAttribute("id", "scrollbarDummy")
			wrapper.appendChild(dummy);
			document.body.appendChild(wrapper);
		}		
		return 100 - dummy.getBoundingClientRect().width;
	}

	handleScroll(e) {	
		let scrollbarWidth = this.findScrollbarWidth();
		const Content = this.Content.current;
		const Thumb = this.Thumb.current;
		const ContentParent = Content.parentElement;

		// hide default scrollbars
		
		Content.style.width = `${ContentParent.offsetWidth + scrollbarWidth}px`;
		Content.style.height = `${ContentParent.offsetHeight + scrollbarWidth}px`;
		
		// update thumb height and position
		Thumb.style.height = `${Content.clientHeight / Content.scrollHeight * 100}%`;
		Thumb.style.top = `${Content.scrollTop / Content.scrollHeight * 100}%`;
	}

	componentDidMount () {
		this.handleScroll();
	}



	handleOnMouseDown(e) {
		e.preventDefault();
		console.log("mouseDown");
		this.dragEnabled = true;
		e.target.style.position = "fixed";
		e.target.style.left = `0px`;
		this.prevMouseDownPosY = e.clientY;
	}

	handleOnMouseMove(e) {
		if (this.dragEnabled) {
			console.log(e.clientY);	
			let delta = e.clientY - this.prevMouseDownPosY;
			this.prevMouseDownPosY = e.clientY;
			this.refs.Content.scrollBy(0, delta * this.refs.Content.scrollHeight / this.refs.Content.clientHeight );
		}
	}

	handleOnMouseUp(e) {
		console.log("mouseUp | Out");
		this.dragEnabled = false;
		e.target.style.position = "absolute";
	}

	handleOnDragStart(e) {
		e.preventDefault();
	}

	render() {
		return (
			<ScrollWrapper ref={this.Wrapper}>
				<CustomScrollbarWrapper>
					<CustomScrollbarFiller>

						<div ref={this.Dummy} style={{width: "100%", height:"100%", opacity: 0, backgroundColor: "red", top: 0, position: "absolute", zIndex: 99}}
							onDragStart={this.handleOnDragStart}
							onMouseDown={this.handleOnMouseDown}
							onMouseMove={this.handleOnMouseMove}
							onMouseUp={this.handleOnMouseUp}
							onMouseLeave={this.handleOnMouseUp}
							//onDrag={this.handleOnDrag}
						></div> 
						<CustomScrollbarElement ref={this.Thumb}  />
					</CustomScrollbarFiller>
				</CustomScrollbarWrapper>
				<DefaultScrollHider>
					<Content ref={this.Content}	onScroll={this.handleScroll}>		
						{this.props.children}
					</Content>
				</DefaultScrollHider>
			</ScrollWrapper>
		)
	}
}


