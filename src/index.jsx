import React, { Component } from 'react'
import styled, { createGlobalStyle } from 'styled-components'


export default class Scrollbar extends Component {
	constructor() {
		super();

		// functional variables
		this.dragEnabled = false;
		this.prevMouseDownPos = 0;
		
		// dependent defaults
		this.height = null;
		this.size = 4;
		this.draggingTriggerSize = 8;
		this.trackOffsetFromEdge = 2;
		this.radius = 4;
		this.thumbColor = "rgb(128, 128, 128)";
		this.thumbDragColor = "rgba(0, 0, 0, 0.75)";
		this.paddingTop = 0;
		this.paddingLeft = 0;
		this.paddingRight = this.trackOffsetFromEdge;
		this.paddingBottom = this.trackOffsetFromEdge;

		// boilerplate
		this.Wrapper = React.createRef();
		this.Content = React.createRef();
		this.ThumbX = React.createRef();
		this.ThumbY = React.createRef();
		this.DummyX = React.createRef();
		this.DummyY = React.createRef();
		this.update = this.update.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleMouseOverComponent = this.handleMouseOverComponent.bind(this);
		this.handleMouseLeaveComponent = this.handleMouseLeaveComponent.bind(this);
	}

	componentWillMount() {
		// set colors
		if (this.props.thumbColor) this.thumbColor = this.props.thumbColor;
		if (this.props.thumbDragColor) this.thumbDragColor = this.props.thumbDragColor;

		// draggingTriggerSize
		if (this.props.size) this.size = parseInt(this.props.size);
		if (this.props.trackOffsetFromEdge) this.trackOffsetFromEdge = parseInt(this.props.trackOffsetFromEdge);
		if (this.props.draggingTriggerSize) this.draggingTriggerSize = parseInt(this.props.draggingTriggerSize);
		else this.draggingTriggerSize = parseInt(this.size) + parseInt(this.trackOffsetFromEdge) * 2;
		
		// radius
		if (this.props.radius) this.radius = this.props.radius;
		else this.radius = this.size;
	}

	componentDidMount() {
		if (this.Content.current.offsetHeight == this.Content.current.scrollHeight + this.findDefaultScrollbarSize()) {
			this.ThumbY.current.parentElement.style.opacity = 0;
		}
		window.addEventListener("resize", this.update);
		
		this.update();
	}

	findDefaultScrollbarSize() {
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

	findHeight(el) {
		if (this.props.height)
			this.height = this.props.height;
		else {
			let computedStyles = window.getComputedStyle(el.parentElement);
			let paddingTop = parseInt(computedStyles.getPropertyValue("padding-top"));
			let paddingBottom = parseInt(computedStyles.getPropertyValue("padding-top"));
			this.height = el.parentElement.offsetHeight - paddingTop - paddingBottom;
		}
	}

	update(e) {	
		const defaultScrollbarWidth = this.findDefaultScrollbarSize();	
		const Wrapper = this.Wrapper;//.current;
		const Content = this.Content.current;
		const ThumbX = this.ThumbX.current;
		const ThumbY = this.ThumbY.current;
		const ContentParent = Content.parentElement;
		
		this.findHeight(Wrapper);
		Wrapper.style.height = `${this.height}px`;

		// HIDING DEFAULT SCROLLBARS	
		Content.style.width = `${ContentParent.offsetWidth + defaultScrollbarWidth}px`;	
		Content.style.height = `${ContentParent.offsetHeight + defaultScrollbarWidth}px`;
		
		// update ThumbY height and position
		ThumbY.style.height = `${Content.clientHeight / Content.scrollHeight * 100}%`;
		ThumbY.style.top = `${Content.scrollTop / Content.scrollHeight * 100}%`;

		// update ThumbX height and position
		ThumbX.style.width = `${Content.clientWidth / Content.scrollWidth * 100}%`;
		ThumbX.style.left = `${Content.scrollLeft / Content.scrollWidth * 100}%`;

		// ADJUSTING CUSTOM SCROLLBARS
		// hide vertical scrollbar if unnecessary
		if (Content.scrollHeight == Content.clientHeight){
			ThumbY.parentElement.style.opacity = 0;
			this.paddingRight = 0;
		} else {
			ThumbY.parentElement.style.opacity = 1;
			this.paddingRight = this.size + this.trackOffsetFromEdge;
		}

		// hide horizontal scrollbar if unnecessary
		if (Content.scrollWidth == Content.clientWidth) {
			ThumbX.parentElement.style.opacity = 0;
			this.paddingBottom = 0;
		} else {
			ThumbX.parentElement.style.opacity = 1;
			this.paddingBottom = this.size + this.trackOffsetFromEdge;
		}

		ThumbY.parentElement.parentElement.style.paddingBottom = `${this.paddingBottom}px`;
		ThumbX.parentElement.parentElement.style.paddingRight = `${this.paddingRight}px`;

	}

	handleMouseOverComponent(e) {
		const Content = this.Content.current;
		
		if (Content.scrollWidth > Content.clientWidth) {
			this.ThumbX.current.parentElement.style.opacity = 1; 
		}
		if (Content.scrollHeight > Content.clientHeight) {
			this.ThumbY.current.parentElement.style.opacity = 1; 
		}
	}

	handleMouseLeaveComponent(e) {
		this.ThumbX.current.parentElement.style.opacity = 0; 
		this.ThumbY.current.parentElement.style.opacity = 0; 
	}

	handleMouseDown(e) {
		this.dragEnabled = true;
		e.target.style.position = "fixed";
		e.target.style.width = "100%";
		e.target.style.height = "100%";
		e.target.style.top = "0px";
		e.target.style.left = "0px";

		this.Wrapper.classList.add("drag");

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
		this.dragEnabled = false;
		e.target.style.position = "absolute";
		this.Wrapper.classList.remove("drag");

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

	handleWheel(e) {	
		//TODO: smooth scrolling
		if (e.target == this.DummyY.current) {
			this.Content.current.scrollBy(0, e.deltaY);
		}
		if (e.target == this.DummyX.current) {		
			this.Content.current.scrollBy(e.deltaY, 0);
		}
	}

	handleDragStart(e) {
		e.preventDefault();
	}


	render() {
		return (
			<ScrollWrapper ref={el => {
				this.Wrapper = el;
				this.findHeight(el);
			}}
				onMouseOver={this.handleMouseOverComponent}
				onMouseLeave={this.handleMouseLeaveComponent}>
				<React.Fragment>
				<CustomScrollbarWrapper
					width={`${this.size}px`}
					paddingTop={`${this.paddingTop}px`}
					paddingBottom={`${this.paddingBottom}px`}
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
							onWheel={this.handleWheel}
						/> 
						<CustomScrollbarElement ref={this.ThumbY}
							color={this.thumbColor}
							radius={`${this.radius}px`}
						/>
					</CustomScrollbarFiller>
				</CustomScrollbarWrapper>
				<CustomScrollbarWrapper
					height={`${this.size}px`}
					paddingLeft={`${this.paddingLeft}px`}
					paddingRight={`${this.paddingRight}px`}
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
							onWheel={this.handleWheel}
						/> 
						<CustomScrollbarElement ref={this.ThumbX}
							color={this.thumbColor}
							radius={`${this.radius}px`}
						/>
					</CustomScrollbarFiller>
				</CustomScrollbarWrapper>
				<DefaultScrollHider>
					<Content ref={this.Content}	onScroll={this.update}>		
						{this.props.children}
					</Content>
				</DefaultScrollHider>
			</React.Fragment>
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
	box-sizing: border-box;
	padding-top:  ${props => props.paddingTop || "0"};
	padding-bottom:  ${props => props.paddingBottom || "0"};
	padding-left:  ${props => props.paddingLeft || "0"};
	padding-right:  ${props => props.paddingRight || "0"};
	z-index: 90;
`;

const CustomScrollbarFiller = styled.div`
	width: 100%;
	height: 100%;
	background: ${props => props.bgColor || "rgba(0,0,0,0)"};
	position: relative;
	border-radius: ${props => props.radius || "0px"};
	transition: 0.1s;
	opacity: 0;
`;

const CustomScrollbarElement = styled.div`
	width: 100%;
	height: ${props => props.height || "100%"};
	background-color: ${props => props.color || "#888"};
	position: absolute;
	top: 0;
	left: 0;
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
