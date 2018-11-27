import React, { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

var theme = {
	gutter: 8
}


export default class Scrollbar extends Component {
	constructor() {
		super();
		this.dragEnabled = false;
		this.prevMouseDownPosY = 0;
		this.scrollbarWidth = 4;
		this.scrollbarCaptureAreaWidth = 8;

		// boilerplate
		this.Wrapper = React.createRef();
		this.Content = React.createRef();
		this.ThumbY = React.createRef();
		this.Dummmy = React.createRef();
		this.handleScroll = this.handleScroll.bind(this);
		this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
		this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
		this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
		this.handleOnDragStart = this.handleOnDragStart.bind(this);
	}

	componentDidMount () {
		if (this.Content.current.offsetHeight == this.Content.current.scrollHeight + this.findScrollbarWidth()) {
			this.ThumbY.current.parentElement.style.opacity = 0;
		}
		this.handleScroll();
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

	isOtherScrollbarActivated() {
		let dummy = document.getElementById('scrollbarActiveDummy');
		if (!dummy) {
			
			return false;
		}		
		return true;
	}

	handleScroll(e) {	
		const scrollbarWidth = this.findScrollbarWidth();	
		const Wrapper = this.Wrapper.current;
		const Content = this.Content.current;
		const ThumbY = this.ThumbY.current;
		const ContentParent = Content.parentElement;
		

		// hide default scrollbars	
		Content.style.width = `${ContentParent.offsetWidth + scrollbarWidth}px`;	

		if (!this.props.height)
			Wrapper.style.height = `${Content.offsetHeight - scrollbarWidth}px`;
		Content.style.height = `${ContentParent.offsetHeight + scrollbarWidth}px`;
		
		// update ThumbY height and position
		ThumbY.style.height = `${Content.clientHeight / Content.scrollHeight * 100}%`;
		ThumbY.style.top = `${Content.scrollTop / Content.scrollHeight * 100}%`;
	}

	handleOnMouseDown(e) {
		this.dragEnabled = true;
		e.target.style.position = "fixed";
		e.target.style.left = "0px";
		e.target.style.width = "100%";

		this.prevMouseDownPosY = e.clientY;
		this.ThumbY.current.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
	}

	handleOnMouseMove(e) {
		if (this.dragEnabled) {
			const Content = this.Content.current;
			let delta = e.clientY - this.prevMouseDownPosY;
			this.prevMouseDownPosY = e.clientY;
			Content.scrollBy(0, delta * Content.scrollHeight / Content.clientHeight );
		}
	}

	handleOnMouseUp(e) {
		this.dragEnabled = false;
		e.target.style.position = "absolute";
		e.target.style.left = `${-this.scrollbarCaptureAreaWidth/2}px`;
		e.target.style.width = `${this.scrollbarCaptureAreaWidth}px`;;
		this.ThumbY.current.style.backgroundColor = "rgba(128, 128, 128, 1)";
	}

	handleOnDragStart(e) {
		e.preventDefault();
	}


	render() {
		return (
			<ScrollWrapper ref={this.Wrapper} width={this.props.width} height={this.props.height}>
				<CustomScrollbarWrapper>
					<CustomScrollbarFiller>
						<Dummy ref={this.Dummy}
							width={`${this.scrollbarCaptureAreaWidth}px`}
							left={`${-this.scrollbarCaptureAreaWidth/2}px`}
							onDragStart={this.handleOnDragStart}
							onMouseDown={this.handleOnMouseDown}
							onMouseMoveCapture={this.handleOnMouseMove}
							onMouseUp={this.handleOnMouseUp}
							onMouseLeave={this.handleOnMouseUp} /> 
						<CustomScrollbarElement ref={this.ThumbY}
							width={`${this.scrollbarWidth}px`}
							left={`${-(this.scrollbarCaptureAreaWidth - this.scrollbarWidth) / 2}px`}
						/>
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


const Dummy = styled.div`
	width: ${props => props.width || "100%"};
	height: 100%;
	opacity: 0;
	background-color: red;
	top: 0;
	left: ${props => props.left || 0};
	position: absolute;
	z-index: 99;
`;

const CustomScrollbarWrapper = styled.div`
	width: ${props => props.width || "4px"};
	height: 100%;
	position: absolute;
	top: 0;
	right: 0;
	z-index: 90;
`;

const CustomScrollbarFiller = styled.div`
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0);
	position: relative;
`;

const CustomScrollbarElement = styled.div`
	width: 100%;
	height: ${props => props.height || "100%"};
	background-color: ${props => props.color || "#888"};
	position: absolute;
	top: 0;
	left: ${props => props.left || 0};
	opacity: 1;
	border-radius: ${props => props.radius || "4px"};
`;

const Content = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	overflow: scroll;
	position: relative;
	display: inline-block;
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
	display: inline-block;
`;