import React, { Component } from 'react'
import styled from 'styled-components'

/* PROPERTIES:
 * width
 * height
 * thumbColor
 * thumbDragColor
 * thumbHoverColor
 * trackColor
 * trackDragColor
 * trackHoverColor
 * size
 * dummySize
 * radius
 * longitudinalOffset
 * showDummy
 * disableAutoHide
 */

//==============================================================================
// COMPONENT VARIATIONS

export function ScrollableBright(props) {
	let {children, thumbDragColor, trackDragColor, thumbHoverColor, thumbColor, ...restProps} = props;
	thumbColor = thumbColor || "rgba(255, 255, 255, 0.25)";
	thumbHoverColor = thumbHoverColor || "rgba(255, 255, 255, 0.5)";
	thumbDragColor = thumbDragColor || "rgba(255, 255, 255, 0.75)";
	trackDragColor = trackDragColor || "rgba(255, 255, 255, 0.25)";
	return (
		<Scrollable {...restProps}
			thumbColor={thumbColor}
			thumbHoverColor={thumbHoverColor}
			thumbDragColor={thumbDragColor}
			trackDragColor={trackDragColor}
		>
			{children}
		</Scrollable>
	)
}

//==============================================================================
// THE COMPONENT

/* Default scrolling is not turned off. Default scrollbars are hidden by CSS. To
 * get size of default scrollbar, hidden element is created.
 *
 * When thumb was dragged, browser was changing cursor. To prevent that, the
 * component uses fake drag system (mouseDown, mouseMove, mouseUp). Dragging is
 * recreated with help of Dummy elements. When event 'mousedown' is fired, the
 * dummy element covers whole screen.
 */
export default class Scrollable extends Component {
	constructor(props) {
		super(props);

		// used by drag emulating functions
		this.dragEnabled = false;
		this.prevMouseDownPos = 0;
		
		// public properties
		this.width = null;
		this.height = null;
		this.thumbColor = this.props.thumbColor || "rgb(0, 0, 0, 0.25)";
		this.thumbHoverColor = this.props.thumbHoverColor || "rgba(0, 0, 0, 0.5)";
		this.thumbDragColor = this.props.thumbDragColor || "rgba(0, 0, 0, 0.75)";
		this.trackColor = this.props.trackColor || "rgba(0,0,0,0)";
		this.trackHoverColor = this.props.trackHoverColor || "rgba(0,0,0,0)";
		this.trackDragColor = this.props.trackDragColor || "rgba(0,0,0,0.1)";
		this.size = parseInt(this.props.size) || 4;
		this.radius = parseInt(this.props.radius) || this.size;
		this.longitudinalOffset = parseInt(this.props.longitudinalOffset) || 2;
		this.dummySize = this.props.dummySize || this.size + this.longitudinalOffset * 2;
		this.showDummy = this.props.showDummy || false;
		this.disableAutoHide = this.props.disableAutoHide || false;
		this.transitionTime = this.props.transitionTime || "0.1s";

		// private properties
		this.scrollbarXOffsetA = 0;
		this.scrollbarYOffsetA = 0;
		this.scrollbarXOffsetB = this.longitudinalOffset;
		this.scrollbarYOffsetB = this.longitudinalOffset;
	}

	componentDidMount() {
		window.addEventListener("resize", this.handleResize);
		this.handleResize();
		this.ThumbX.parentElement.style.transition = this.transitionTime;
		this.ThumbY.parentElement.style.transition = this.transitionTime;
	}

	//--------------------------------------------------------------------------
	// THE CORE

	update = () => {	
		// set component's width
		this.Wrapper.style.width = `${this.width}px`;
		
		
		this.Wrapper.style.height = `${this.height}px`;

		// hide default scrollbars	
		const defaultScrollbarSize = this.getDefaultScrollbarSize();		
		this.Content.style.width = `${this.Content.parentElement.offsetWidth + defaultScrollbarSize}px`;	
		this.Content.style.height = `${this.Content.parentElement.offsetHeight + defaultScrollbarSize}px`;

		// update thumbs' height and position
		this.ThumbY.style.height = `${this.Content.clientHeight / this.Content.scrollHeight * 100}%`;
		this.ThumbY.style.top = `${this.Content.scrollTop / this.Content.scrollHeight * 100}%`;
		this.ThumbX.style.width = `${this.Content.clientWidth / this.Content.scrollWidth * 100}%`;
		this.ThumbX.style.left = `${this.Content.scrollLeft / this.Content.scrollWidth * 100}%`;

		// prevent scrollbars' overlapping
		if (this.Content.scrollHeight == this.Content.clientHeight) this.scrollbarXOffsetB = 0;
		else this.scrollbarXOffsetB = this.size + this.longitudinalOffset;
		if (this.Content.scrollWidth == this.Content.clientWidth) this.scrollbarYOffsetB = 0;
		else this.scrollbarYOffsetB = this.size + this.longitudinalOffset;
		this.ThumbY.parentElement.parentElement.style.paddingBottom = `${this.scrollbarYOffsetB}px`;
		this.ThumbX.parentElement.parentElement.style.paddingRight = `${this.scrollbarXOffsetB}px`;
	}

	//--------------------------------------------------------------------------
	//UTILS

	getDefaultScrollbarSize() {
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

	//--------------------------------------------------------------------------
	// HANDLERS

	handleResize = (e) => {
		// calculate component's width
		this.width = this.Wrapper.parentElement.offsetWidth - this.getDefaultScrollbarSize();
		if (this.props.width && this.props.width < this.width) this.width = this.props.width;

		this.update();

		// calculate component's height
		//FIXME: respect siblings
		// if height is not specified, use all parent's space
		let computedStyles = window.getComputedStyle(this.Wrapper.parentElement);
		let paddingTop = parseInt(computedStyles.getPropertyValue("padding-top"));
		let paddingBottom = parseInt(computedStyles.getPropertyValue("padding-top"));	
		this.height = this.Wrapper.parentElement.offsetHeight - paddingTop - paddingBottom;

		// don't use all space if this is unnecessary
		if (this.contentHeight < this.height)
			this.height = this.contentHeight;
		if (this.props.height && this.props.height < this.height) this.height = this.props.height;

		if (this.disableAutoHide) {
			if (this.Content.scrollWidth > this.Content.clientWidth) this.ThumbX.parentElement.style.opacity = 1; 
			else this.ThumbX.parentElement.style.opacity = 0; 
			if (this.Content.scrollHeight > this.Content.clientHeight) this.ThumbY.parentElement.style.opacity = 1;
			else this.ThumbY.parentElement.style.opacity = 0;
		}

		this.update();
	}

	handleMouseOverComponent = (e) => {	
		// show scrollbars if they're necessary
		if (this.Content.scrollWidth > this.Content.clientWidth) this.ThumbX.parentElement.style.opacity = 1; 
		else this.ThumbX.parentElement.style.opacity = 0; 
		if (this.Content.scrollHeight > this.Content.clientHeight) this.ThumbY.parentElement.style.opacity = 1;
		else this.ThumbY.parentElement.style.opacity = 0;
	}

	handleMouseLeaveComponent = (e) => {
		// hide scrollbars
		if (!this.disableAutoHide)
			this.ThumbX.parentElement.style.opacity = 0; 
		if (!this.disableAutoHide)
			this.ThumbY.parentElement.style.opacity = 0; 
	}

	handleMouseMove = (e) => {
		// FIXME: if thumb is being dragged and cursor is over other custom scrollbar, dragging is interrupted
		if (this.dragEnabled) {
			if (e.target == this.DummyY) {
				let delta = e.clientY - this.prevMouseDownPos;
				this.prevMouseDownPos = e.clientY;
				this.Content.scrollBy(0, delta * this.Content.scrollHeight / this.Content.clientHeight);
			} else {
				let delta = e.clientX - this.prevMouseDownPos;
				this.prevMouseDownPos = e.clientX;
				this.Content.scrollBy(delta * this.Content.scrollWidth / this.Content.clientWidth, 0);
			}
		} else {
			if (e.target == this.DummyY) {
				this.ThumbY.style.backgroundColor = this.thumbHoverColor;
				this.ThumbY.parentElement.style.backgroundColor = this.trackHoverColor;
			} else {
				this.ThumbX.style.backgroundColor = this.thumbHoverColor;
				this.ThumbX.parentElement.style.backgroundColor = this.trackHoverColor;
			}
		}
	}

	handleMouseDown = (e) => {
		this.dragEnabled = true;
		this.Wrapper.classList.add("drag");

		// fullscreen dummy
		e.target.style.position = "fixed";
		e.target.style.width = "100%";
		e.target.style.height = "100%";
		e.target.style.top = "0px";
		e.target.style.left = "0px";
		if (e.target == this.DummyY) {
			this.prevMouseDownPos = e.clientY;
			this.ThumbY.style.backgroundColor = this.thumbDragColor;
			this.ThumbY.parentElement.style.backgroundColor = this.trackDragColor;
		} else {
			this.prevMouseDownPos = e.clientX;
			this.ThumbX.style.backgroundColor = this.thumbDragColor;
			this.ThumbX.parentElement.style.backgroundColor = this.trackDragColor;
		} 
	}

	handleMouseLeave = (e) => {
		this.handleMouseUp(e, true);
	}

	handleMouseUp = (e, bLeave=false) => {
		this.dragEnabled = false;
		this.Wrapper.classList.remove("drag");

		// reset dummy
		//FIXME: color flickering
		let thumbResetColor = this.thumbHoverColor;
		let trackResetColor = this.trackHoverColor;
		if (bLeave) {
			thumbResetColor = this.thumbColor;
			trackResetColor = this.trackColor;
		}

		e.target.style.position = "absolute";
		if (e.target == this.DummyY) {
			e.target.style.width = `${this.dummySize}px`;
			e.target.style.left = `auto`;
			e.target.style.right = `${-this.longitudinalOffset}px`;
			this.ThumbY.style.backgroundColor = thumbResetColor;
			this.ThumbY.parentElement.style.backgroundColor = trackResetColor;
		} else {
			e.target.style.height = `${this.dummySize}px`;
			e.target.style.top = `auto`;
			e.target.style.bottom = `${-this.longitudinalOffset}px`;
			this.ThumbX.style.backgroundColor = thumbResetColor;
			this.ThumbX.parentElement.style.backgroundColor = trackResetColor;
		}
	}

	handleWheel = (e) => {	
		//TODO: smooth scrolling or find a way to make wheel work on scrollbar
		if (e.target == this.DummyY) this.Content.scrollBy(0, e.deltaY);
		if (e.target == this.DummyX) this.Content.scrollBy(e.deltaY, 0);
	}

	//--------------------------------------------------------------------------

	render() {
		return (
			<Wrapper ref={el => (this.Wrapper = el)}
				onMouseOver={this.handleMouseOverComponent}
				onMouseLeave={this.handleMouseLeaveComponent}>
				<ScrollbarWrapper className="scrollbar scrollbar-y"
					width={`${this.size}px`}
					paddingTop={`${this.scrollbarYOffsetA}px`}
					paddingBottom={`${this.scrollbarYOffsetB}px`}
					right={`${this.longitudinalOffset}px`}
					top="0px"
					visible={this.disableAutoHide}>
					<Track className="scrollbar-track"
						bgColor={this.trackColor}
						radius={`${this.radius}px`}
						visible={this.disableAutoHide}>
						<Dummy className="scrollbar-dummy" 
							ref={(el) => (this.DummyY=el)}
							width={`${this.dummySize}px`}
							top="0px"
							right={`${-this.longitudinalOffset}px`}
							transitionTime={this.transitionTime}
							visible={this.showDummy}
							onDragStart={(e) => e.preventDefault()}
							onMouseDown={this.handleMouseDown}
							onMouseMoveCapture={this.handleMouseMove}
							onMouseUp={this.handleMouseUp}
							onMouseLeave={this.handleMouseLeave}
							onWheel={this.handleWheel}
						/> 
						<Thumb className="scrollbar-thumb"
							ref={(el) => (this.ThumbY=el)}
							bgColor={this.thumbColor}
							transitionTime={this.transitionTime}
							radius={`${this.radius}px`}
						/>
					</Track>
				</ScrollbarWrapper>
				<ScrollbarWrapper className="scrollbar scrollbar-x"
					height={`${this.size}px`}
					paddingLeft={`${this.scrollbarXOffsetA}px`}
					paddingRight={`${this.scrollbarYOffsetB}px`}
					bottom={`${this.longitudinalOffset}px`}
					left="0px">
					<Track className="scrollbar-track"
						bgColor={this.trackColor}
						radius={`${this.radius}px`}
						visible={this.disableAutoHide}>
						<Dummy className="scrollbar-dummy"
							ref={(el) => (this.DummyX=el)}
							height={`${this.dummySize}px`}
							left="0px"
							bottom={`${-this.longitudinalOffset}px`}
							visible={this.showDummy}
							onDragStart={(e) => e.preventDefault()}
							onMouseDown={this.handleMouseDown}
							onMouseMoveCapture={this.handleMouseMove}
							onMouseUp={this.handleMouseUp}
							onMouseLeave={this.handleMouseLeave}
							onWheel={this.handleWheel}
						/> 
						<Thumb className="scrollbar-thumb"
							ref={(el) => (this.ThumbX=el)}
							bgColor={this.thumbColor}
							transitionTime={this.transitionTime}
							radius={`${this.radius}px`}
						/>
					</Track>
				</ScrollbarWrapper>
				<Hider>
					<Content ref={el => {							
							this.Content = el;
							/* Set up dimensions. WidthPreSetter changes width
							 * before this function call, to get actual height.
							 */
							this.contentHeight = el.offsetHeight;
							if (!this.props.width) this.width = el.offsetWidth;
							else this.width = this.props.width;
						}}
						onScroll={this.update}>	
						<WidthPreSetter width={this.props.width}>
							{this.props.children}
						</WidthPreSetter>	
					</Content>
				</Hider>
			</Wrapper>
		)
	}
}

//==============================================================================
// STYLED COMPONENTS

const Wrapper = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	position: relative;
	overflow: hidden;
`;

const ScrollbarWrapper = styled.div`
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

const Track = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${props => props.bgColor || "rgba(0,0,0,0)"};
	position: relative;
	border-radius: ${props => props.radius || "0px"};
	opacity: ${props => {
		if (props.visible) return 1;
		else return 0;
	}};
`;

const Thumb = styled.div`
	width: 100%;
	height: ${props => props.height || "100%"};
	background-color: ${props => props.bgColor || "#888"};
	position: absolute;
	top: 0;
	left: 0;
	border-radius: ${props => props.radius || "4px"};
	transition: background-color ${props => props.transitionTime || "0.1s"};
`;

const Dummy = styled.div`
	opacity: ${props => {
		if (props.visible) return 0.4;
		else return 0;
	}};
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	background-color: pink;
	top: ${props => props.top || "auto"};
	left: ${props => props.left || "auto"};
	right: ${props => props.right || "auto"};
	bottom: ${props => props.bottom || "auto"};
	position: absolute;
	z-index: 99;
`;

const Content = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	overflow: scroll;
	position: relative;
	display: inline-block;
`;

const Hider = styled.div`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
	overflow: hidden;
	display: inline-block;
`;

const WidthPreSetter = styled.div`
	width: ${props => {
		if (props.width) return `${props.width}px`;
		else return "100%";
	}};
`;