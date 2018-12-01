import React, { Component } from 'react'
import Scrollable, {ScrollableBright} from 'kas-scrollable'
import styled from 'styled-components'


export default class Demo extends Component {
	render() {
		const widgetWidth = "25%";
		const widgetHeight = "300px";
		const scrollbarWidth = "200";
		const scrollbarHeight = "200";

		return (
			<React.Fragment>
				<WidgetWrapper>
					<Widget width={widgetWidth} height={widgetHeight}>
						<ScrollableBright>
							<Block />
						</ScrollableBright>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<ScrollableBright width={scrollbarWidth}>
							<Block />
						</ScrollableBright>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<ScrollableBright height={scrollbarHeight}>
							<Block />
						</ScrollableBright>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<ScrollableBright width={scrollbarWidth} height={scrollbarHeight}>
							<Block />
						</ScrollableBright>			
					</Widget>
				</WidgetWrapper>

				<WidgetWrapper>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<Scrollable>		
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
						</Scrollable>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>			
						<Scrollable width={scrollbarWidth}>		
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
						</Scrollable>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>			
						<Scrollable height={scrollbarHeight}>		
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
						</Scrollable>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<Scrollable width={scrollbarWidth} height={scrollbarHeight}>		
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
						</Scrollable>			
					</Widget>
				</WidgetWrapper>

				<WidgetWrapper>
					<Widget width={widgetWidth} height={widgetHeight}>		
						<Scrollable
							width="300"
							height="300"
							thumbColor="red"
							thumbDragColor="green"
							thumbHoverColor="blue"
							trackColor="green"
							trackDragColor="blue"
							trackHoverColor="red"
							dummySize="40"
							showDummy="true"
							size="10"
							radius="2"
							longitudinalOffset="15"
							disableAutoHide="true"
							transitionTime="0.5s"
							>		
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti a sequi laborum. Veritatis, illum nulla! Reprehenderit cum ut a corporis officia, optio, provident atque excepturi necessitatibus facere maiores tenetur. Amet?
						</Scrollable>			
					</Widget>
					<Widget width={widgetWidth} height={widgetHeight}></Widget>
					<Widget width={widgetWidth} height={widgetHeight}></Widget>
					<Widget width={widgetWidth} height={widgetHeight}></Widget>
				</WidgetWrapper>
			</React.Fragment>
		);
	}
}

//==============================================================================

const WidgetWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Widget = styled.div`
	width: ${props => props.width || "auto"};
	height: ${props => props.height || "auto"};
	padding: ${props => props.padding || "8px"};
	background-color: #EEE;
	box-sizing: border-box;
	
	margin: 8px;
	overflow: hidden;
	border-radius: 5px;
	box-shadow: 0px 1px 3px rgba(0,0,0,0.1);
`;

const Block = styled.div`
	width: 500px;
	height: 500px;
	background-image: url("https://loremflickr.com/600/600");
	background-size: cover;
`;