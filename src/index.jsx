import React, { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'


export default class Scrollbar extends Component {
	constructor() {
		super();

		// functional variables
		this.dragEnabled = false;
		this.prevMouseDownPos = 0;
		
		// dependent defaults
		this.size = 4;
		this.draggingTriggerSize = 8;
		this.trackOffsetFromEdge = 2;
		this.radius = 4;
		this.thumbColor = "rgb(128,128,128)";
		this.thumbDragColor = "rgba(0,0,0,0.75)";

		// boilerplate
		this.Wrapper = React.createRef();
		this.Content = React.createRef();
		this.ThumbX = React.createRef();
		this.ThumbY = React.createRef();
		this.DummyX = React.createRef();
		this.DummyY = React.createRef();
		this.handleScroll = this.handleScroll.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
	}

	componentWillMount() {
		// set colors
		if (this.props.thumbColor) this.thumbColor = this.props.thumbColor;
		if (this.props.thumbDragColor) this.thumbDragColor = this.props.thumbDragColor;

		// draggingTriggerSize
		if (this.props.size) this.size = this.props.size;
		if (this.props.trackOffsetFromEdge) this.trackOffsetFromEdge = this.props.trackOffsetFromEdge;
		if (this.props.draggingTriggerSize) this.draggingTriggerSize = this.props.draggingTriggerSize;
		else this.draggingTriggerSize = parseInt(this.size) + parseInt(this.trackOffsetFromEdge) * 2;
		
		// radius
		if (this.props.radius) this.radius = this.props.radius;
		else this.radius = this.size;
	}

	componentDidMount() {
		if (this.Content.current.offsetHeight == this.Content.current.scrollHeight + this.findDefaultScrollbarWidth()) {
			this.ThumbY.current.parentElement.style.opacity = 0;
		}
		
		this.handleScroll();
	}

	findDefaultScrollbarWidth() {
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
		const defaultScrollbarWidth = this.findDefaultScrollbarWidth();	
		const Wrapper = this.Wrapper.current;
		const Content = this.Content.current;
		const ThumbX = this.ThumbX.current;
		const ThumbY = this.ThumbY.current;
		const ContentParent = Content.parentElement;
		
		// hide default scrollbars	
		Content.style.width = `${ContentParent.offsetWidth + defaultScrollbarWidth}px`;	

		if (!this.props.windowHeight)
			Wrapper.style.height = `${Content.offsetHeight - defaultScrollbarWidth}px`;
		Content.style.height = `${ContentParent.offsetHeight + defaultScrollbarWidth}px`;
		
		// update ThumbY height and position
		ThumbY.style.height = `${Content.clientHeight / Content.scrollHeight * 100}%`;
		ThumbY.style.top = `${Content.scrollTop / Content.scrollHeight * 100}%`;

		// update ThumbX height and position
		ThumbX.style.width = `${Content.clientWidth / Content.scrollWidth * 100}%`;
		ThumbX.style.left = `${Content.scrollLeft / Content.scrollWidth * 100}%`;
	}

	handleMouseDown(e) {
		this.dragEnabled = true;
		e.target.style.position = "fixed";
		e.target.style.width = "100%";
		e.target.style.height = "100%";
		e.target.style.top = "0px";
		e.target.style.left = "0px";

		if (e.target == this.DummyY.current) {
			this.prevMouseDownPos = e.clientY;
			this.ThumbY.current.style.backgroundColor = this.thumbDragColor;
		} else {
			this.prevMouseDownPos = e.clientX;
			this.ThumbX.current.style.backgroundColor = this.thumbDragColor;
		} 
	}

	handleMouseMove(e) {
		if (this.dragEnabled) {
			const Content = this.Content.current;
			if (e.target == this.DummyY.current) {
				let delta = e.clientY - this.prevMouseDownPos;
				this.prevMouseDownPos = e.clientY;
				Content.scrollBy(0, delta * Content.scrollHeight / Content.clientHeight);
			} else {
				let delta = e.clientX - this.prevMouseDownPos;
				this.prevMouseDownPos = e.clientX;
				Content.scrollBy(delta * Content.scrollWidth / Content.clientWidth, 0);
			}
			
		}
	}

	handleMouseUp(e) {
		console.log(this.trackOffsetFromEdge);
		
		this.dragEnabled = false;
		e.target.style.position = "absolute";
		if (e.target == this.DummyY.current) {
			e.target.style.width = `${this.draggingTriggerSize}px`;
			e.target.style.left = `auto`;
			e.target.style.right = `${-this.trackOffsetFromEdge}px`;
			this.ThumbY.current.style.backgroundColor = this.thumbColor;
		} else {
			e.target.style.height = `${this.draggingTriggerSize}px`;
			e.target.style.top = `auto`;
			e.target.style.bottom = `${-this.trackOffsetFromEdge}px`;
			this.ThumbX.current.style.backgroundColor = this.thumbColor;
		}
	}

	handleDragStart(e) {
		e.preventDefault();
	}

	render() {
		return (
			<ScrollWrapper ref={this.Wrapper} width={`${this.props.windowWidth}px`} height={`${this.props.windowHeight}px`}>
				<CustomScrollbarWrapper
					width={`${this.size}px`}
					height={`${this.props.windowHeight - this.size}px`}
					right={`${this.trackOffsetFromEdge}px`}
					top="0px">
					<CustomScrollbarFiller bgColor={this.props.trackColor} radius={`${this.radius}px`}>
						<Dummy ref={this.DummyY}
							width={`${this.draggingTriggerSize}px`}
							top="0px"
							right={`${-this.trackOffsetFromEdge}px`}
							onDragStart={this.handleDragStart}
							onMouseDown={this.handleMouseDown}
							onMouseMoveCapture={this.handleMouseMove}
							onMouseUp={this.handleMouseUp}
							onMouseLeave={this.handleMouseUp}
						/> 
						<CustomScrollbarElement ref={this.ThumbY}
							color={this.thumbColor}
							radius={`${this.radius}px`}
						/>
					</CustomScrollbarFiller>
				</CustomScrollbarWrapper>
				<CustomScrollbarWrapper
					height={`${this.size}px`}
					width={`${this.props.windowWidth - this.draggingTriggerSize}px`}
					bottom={`${this.trackOffsetFromEdge}px`}
					left="0px">
					<CustomScrollbarFiller bgColor={this.props.trackColor} radius={`${this.radius}px`}>
						<Dummy ref={this.DummyX}
							height={`${this.draggingTriggerSize}px`}
							left="0px"
							bottom={`${-this.trackOffsetFromEdge}px`}
							onDragStart={this.handleDragStart}
							onMouseDown={this.handleMouseDown}
							onMouseMoveCapture={this.handleMouseMove}
							onMouseUp={this.handleMouseUp}
							onMouseLeave={this.handleMouseUp}
						/> 
						<CustomScrollbarElement ref={this.ThumbX}
							color={this.thumbColor}
							radius={`${this.radius}px`}
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
	opacity: 0;
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	background-color: red;
	top: ${props => props.top || "auto"};
	left: ${props => props.left || "auto"};
	right: ${props => props.right || "auto"};
	bottom: ${props => props.bottom || "auto"};
	position: absolute;
	z-index: 99;
`;

const CustomScrollbarWrapper = styled.div`
	width: ${props => props.width || "100%"};
	height:  ${props => props.height || "100%"};
	position: absolute;
	top: ${props => props.top || "auto"};
	left: ${props => props.left || "auto"};
	right: ${props => props.right || "auto"};
	bottom: ${props => props.bottom || "auto"};
	z-index: 90;
`;

const CustomScrollbarFiller = styled.div`
	width: 100%;
	height: 100%;
	background: ${props => props.bgColor || "rgba(0,0,0,0)"};
	position: relative;
	border-radius: ${props => props.radius || "0px"};
`;

const CustomScrollbarElement = styled.div`
	width: 100%;
	height: ${props => props.height || "100%"};
	background-color: ${props => props.color || "#888"};
	position: absolute;
	top: 0;
	left: 0;
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