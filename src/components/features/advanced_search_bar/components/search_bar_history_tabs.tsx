import TabItem from "../../tab_item";
import { filterHistoryTabsByString } from "../../../../tools/tab_filters";
import iHistoryState from "../../../../interfaces/states/history_state";

interface iSearchBarHistoryTabsProps {
	items: iHistoryState;
	keyword: string;
}

// Render all filtered history tabs
const SearchBarHistoryTabs = (props: iSearchBarHistoryTabsProps): JSX.Element => {
	const { items, keyword } = props;
	const tabs: Array<chrome.history.HistoryItem> = filterHistoryTabsByString(items, keyword);

	if (tabs.length > 0) {
		const list: Array<JSX.Element> = tabs.map((tab) => {
			const { id, title, url } = tab;

			return (
				<TabItem
					key={`tab-history-sr-key-${id}`}
					marked={false}
					id={parseInt(id)}
					label={title!}
					url={url!}
				/>
			);
		});

		return <ul className="list-none">{list}</ul>;
	}

	return <p className="text-center p-2">There are no results in this section</p>;
};

export default SearchBarHistoryTabs;
